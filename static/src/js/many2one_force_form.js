/** @odoo-module **/

import { Many2OneField } from "@web/views/fields/many2one/many2one_field";
import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";

const PARTNER_FIELDS = ["partner_id", "partner_shipping_id", "partner_invoice_id"];
const TARGET_MODELS = ["sale.order", "purchase.order"];

patch(Many2OneField.prototype, {
    setup() {
        super.setup();
        this._actionService = useService("action");
    },

    _patchAutocompleteProps(props) {
        if (!props || typeof props !== "object") return props;
        const resModel = this.props.record?.resModel;
        const fieldName = this.props.name;

        if (TARGET_MODELS.includes(resModel) && PARTNER_FIELDS.includes(fieldName)) {
            props.quickCreate = null;
            const actionService = this._actionService;
            const record = this.props.record;
            const fieldKey = this.props.name;

            props.createAction = async (inputName) => {
                const context = record.getFieldContext(fieldKey);
                const defaultContext = {
                    ...context,
                    default_name: inputName,
                };
                if (resModel === "purchase.order") {
                    defaultContext.default_supplier_rank = 1;
                } else {
                    defaultContext.default_customer_rank = 1;
                }
                await actionService.doAction({
                    type: "ir.actions.act_window",
                    res_model: "res.partner",
                    views: [[false, "form"]],
                    target: "current",
                    context: defaultContext,
                });
            };
        }
        return props;
    },

    get Many2XAutocompleteProps() {
        const props = super.Many2XAutocompleteProps;
        return this._patchAutocompleteProps(props);
    },
});