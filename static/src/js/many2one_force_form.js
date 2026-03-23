/** @odoo-module **/

import { Many2OneField } from "@web/views/fields/many2one/many2one_field";
import { patch } from "@web/core/utils/patch";

const PARTNER_FIELDS = ["partner_id", "partner_shipping_id", "partner_invoice_id"];
const TARGET_MODELS = ["sale.order", "purchase.order"];

patch(Many2OneField.prototype, {
    get Many2XAutocompleteProps() {
        const props = super.Many2XAutocompleteProps;
        
        // Check if this is a partner field in a sale/purchase order
        const resModel = this.props.record?.resModel;
        const fieldName = this.props.name;
        
        if (TARGET_MODELS.includes(resModel) && PARTNER_FIELDS.includes(fieldName)) {
            // Disable quick create (typing name + Enter to create)
            props.quickCreate = null;
            
            // Force "Create and Edit" to open full form instead of dialog
            props.createAction = async (name) => {
                const context = this.props.record.getFieldContext(this.props.name);
                // Navigate to full form view for res.partner
                await this.env.services.action.doAction({
                    type: "ir.actions.act_window",
                    res_model: "res.partner",
                    views: [[false, "form"]],
                    target: "current",
                    context: {
                        ...context,
                        default_name: name,
                        // For purchase orders, default to supplier
                        ...(resModel === "purchase.order" ? { default_supplier_rank: 1 } : { default_customer_rank: 1 }),
                    },
                });
            };
        }
        
        return props;
    },
});
