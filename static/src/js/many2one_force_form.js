/** @odoo-module **/

import { Many2OneField } from "@web/views/fields/many2one/many2one_field";
import { patch } from "@web/core/utils/patch";

const PARTNER_FIELDS = ["partner_id", "partner_shipping_id", "partner_invoice_id"];
const TARGET_MODELS = ["sale.order", "purchase.order"];

patch(Many2OneField.prototype, {
    get m2oProps() {
        const props = super.m2oProps;
        if (!props || typeof props !== "object") return props;

        const resModel = this.props.record?.resModel;
        const fieldName = this.props.name;

        if (TARGET_MODELS.includes(resModel) && PARTNER_FIELDS.includes(fieldName)) {
            // Disable quick create — set canQuickCreate if it exists
            if ("canQuickCreate" in props) {
                props.canQuickCreate = false;
            }
        }

        return props;
    },
});