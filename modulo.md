## ./__init__.py
```py
# -*- coding: utf-8 -*-
from . import models```

## ./__manifest__.py
```py
{
    "name": "Force Full Form for Contact Creation",
    "version": "19.0.1.0.0",
    "category": "Sales",
    "summary": "Blocks quick-create for contacts and redirects to full form",
    "description": """
Blocks quick-create (name_create) for res.partner to prevent creating
contacts without filling required information. Users must use the full
contact form to create new partners.
    """,
    "author": "Alphaqueb Consulting",
    "website": "https://alphaqueb.com",
    "license": "LGPL-3",
    "depends": ["sale", "purchase"],
    "assets": {
        "web.assets_backend": [
            "force_full_form_contact/static/src/js/many2one_force_form.js",
        ],
    },
    "installable": True,
    "auto_install": False,
}```

## ./models/__init__.py
```py
# -*- coding: utf-8 -*-
from . import res_partner```

## ./models/res_partner.py
```py
# -*- coding: utf-8 -*-
from odoo import models, _
from odoo.exceptions import UserError


class ResPartner(models.Model):
    _inherit = "res.partner"

    def name_create(self, name):
        """Block quick-create of contacts. Forces full form usage."""
        if self.env.context.get("force_full_form_contact_allowed"):
            return super().name_create(name)

        raise UserError(_(
            "No es posible crear contactos de forma rápida.\n\n"
            "Por favor utilice 'Crear y editar' para abrir el formulario "
            "completo del contacto, o créelo desde el menú de Contactos."
        ))```

## ./static/src/js/many2one_force_form.js
```js
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
});```

