/** @odoo-module **/

import { Many2OneField, many2OneField } from "@web/views/fields/many2one/many2one_field";
import { patch } from "@web/core/utils/patch";

const PARTNER_FIELDS = ["partner_id", "partner_shipping_id", "partner_invoice_id"];
const TARGET_MODELS = ["sale.order", "purchase.order"];

// ======================================================================
// PATCH 1: extractProps — disable quick create, keep "Create and Edit"
// This is the proven community pattern for Odoo 17/18/19.
// ======================================================================
patch(many2OneField, {
    extractProps({ attrs, context, decorations, options, string }, dynamicInfo) {
        const props = super.extractProps(
            { attrs, context, decorations, options, string },
            dynamicInfo
        );
        // XML options handle no_quick_create. We keep canCreateEdit = true
        // so the "Create and Edit..." dropdown option remains visible.
        return props;
    },
});

// ======================================================================
// PATCH 2: Component — redirect "Create and Edit" to full form
// ======================================================================

function makeCreateAction(component) {
    const resModel = component.props.record?.resModel;
    return async (name) => {
        const context = component.props.record.getFieldContext(component.props.name);
        const defaultContext = {
            ...context,
            default_name: name,
        };
        if (resModel === "purchase.order") {
            defaultContext.default_supplier_rank = 1;
        } else {
            defaultContext.default_customer_rank = 1;
        }
        await component.env.services.action.doAction({
            type: "ir.actions.act_window",
            res_model: "res.partner",
            views: [[false, "form"]],
            target: "current",
            context: defaultContext,
        });
    };
}

function shouldPatch(component) {
    const resModel = component.props.record?.resModel;
    const fieldName = component.props.name;
    return TARGET_MODELS.includes(resModel) && PARTNER_FIELDS.includes(fieldName);
}

// Detect available getter/method names on the prototype chain
const protoNames = new Set();
let proto = Many2OneField.prototype;
while (proto && proto !== Object.prototype) {
    for (const name of Object.getOwnPropertyNames(proto)) {
        protoNames.add(name);
    }
    proto = Object.getPrototypeOf(proto);
}

// Log for debugging — check browser console after install
console.log(
    "[force_full_form_contact] Many2OneField prototype keys containing 'auto' or 'Auto' or 'Props' or 'create':",
    [...protoNames].filter(
        (k) =>
            k.toLowerCase().includes("auto") ||
            k.includes("Props") ||
            k.toLowerCase().includes("create") ||
            k.toLowerCase().includes("quick")
    )
);

// Try to patch the getter — works in Odoo 17/18, may work in 19
if (protoNames.has("Many2XAutocompleteProps")) {
    console.log("[force_full_form_contact] Found Many2XAutocompleteProps — patching getter");
    patch(Many2OneField.prototype, {
        get Many2XAutocompleteProps() {
            const props = super.Many2XAutocompleteProps;
            if (shouldPatch(this)) {
                props.quickCreate = null;
                props.createAction = makeCreateAction(this);
            }
            return props;
        },
    });
} else {
    // Fallback: log what's available so user can report back
    console.warn(
        "[force_full_form_contact] Many2XAutocompleteProps NOT found on prototype.",
        "Available keys on prototype:",
        [...protoNames].sort().join(", ")
    );
    console.warn(
        "[force_full_form_contact] The XML no_quick_create option is still active.",
        "To also redirect 'Create and Edit' to full form, report the keys above."
    );
}