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
        ))