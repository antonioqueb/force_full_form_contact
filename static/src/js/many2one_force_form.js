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

    get m2oProps() {
        const props = super.m2oProps;
        if (!props || typeof props !== "object") return props;

        const resModel = this.props.record?.resModel;
        const fieldName = this.props.name;

        if (TARGET_MODELS.includes(resModel) && PARTNER_FIELDS.includes(fieldName)) {
            props.quickCreate = null;

            const self = this;
            props.createAction = async (inputName) => {
                const context = self.props.context || {};
                await self._actionService.doAction(
                    {
                        type: "ir.actions.act_window",
                        res_model: "res.partner",
                        views: [[false, "form"]],
                        target: "new",
                        context: {
                            ...context,
                            default_name: inputName,
                            default_is_company: true,
                            ...(resModel === "purchase.order"
                                ? { default_supplier_rank: 1 }
                                : { default_customer_rank: 1 }),
                        },
                    },
                    {
                        onClose: async (result) => {
                            if (result && result.res_id) {
                                await self.props.record.update({
                                    [fieldName]: [result.res_id, result.name || inputName],
                                });
                            }
                        },
                    }
                );
            };
        }

        return props;
    },
});