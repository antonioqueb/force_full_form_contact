/** @odoo-module **/

import { many2OneField } from "@web/views/fields/many2one/many2one_field";
import { patch } from "@web/core/utils/patch";

/**
 * Patch the field registration object (NOT the component prototype).
 * This is the proven pattern from Odoo 17/18/19 community.
 *
 * - Disables canQuickCreate for all res.partner many2one fields
 * - Keeps canCreateEdit true (opens dialog, but name_create is blocked
 *   in Python so the user gets redirected properly)
 */
patch(many2OneField, {
    extractProps({ attrs, context, decorations, options, string }, dynamicInfo) {
        const props = super.extractProps(
            { attrs, context, decorations, options, string },
            dynamicInfo
        );

        // Check if this field points to res.partner
        if (dynamicInfo && dynamicInfo.field && dynamicInfo.field.relation === "res.partner") {
            props.canQuickCreate = false;
        }

        return props;
    },
});