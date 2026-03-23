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
        this._orm = useService("orm");
    },

    get m2oProps() {
        const props = super.m2oProps;
        if (!props || typeof props !== "object") return props;

        const resModel = this.props.record?.resModel;
        const fieldName = this.props.name;

        if (TARGET_MODELS.includes(resModel) && PARTNER_FIELDS.includes(fieldName)) {
            // Disable quick create
            props.quickCreate = null;

            // Override "Create and Edit" to open FULL form
            const self = this;
            props.createAction = async (inputName) => {
                const context = self.props.context || {};

                // Open full form in dialog, wait for close
                const resId = await new Promise((resolve) => {
                    self._actionService.doAction(
                        {
                            type: "ir.actions.act_window",
                            res_model: "res.partner",
                            views: [[false, "form"]],
                            target: "new",
                            context: {
                                ...context,
                                default_name: inputName,
                                default_is_company: true,
                                form_view_initial_mode: "edit",
                                ...(resModel === "purchase.order"
                                    ? { default_supplier_rank: 1 }
                                    : { default_customer_rank: 1 }),
                            },
                        },
                        {
                            onClose: (infos) => {
                                const id =
                                    infos?.res_id ||
                                    infos?.context?.active_id ||
                                    infos?.id ||
                                    false;
                                resolve(id);
                            },
                        }
                    );
                });

                // If a partner was created, read its name and update the field
                if (resId) {
                    const [partner] = await self._orm.read(
                        "res.partner",
                        [resId],
                        ["display_name"]
                    );
                    if (partner) {
                        self.props.record.update({
                            [fieldName]: [resId, partner.display_name],
                        });
                    }
                }
            };
        }

        return props;
    },
});