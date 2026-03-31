# -*- coding: utf-8 -*-
from odoo import api, models, _
from odoo.exceptions import UserError


class ResPartner(models.Model):
    _inherit = "res.partner"

    @api.model
    def name_create(self, name):
        """Bloquear quick-create de partners desde órdenes de venta/compra."""
        # Siempre bloquear name_create para partners — forzar formulario completo
        raise UserError(_(
            "Para crear un nuevo contacto, utilice la opción "
            "'Crear y editar...' del menú desplegable."
        ))

    @api.model_create_multi
    def create(self, vals_list):
        """Asegurar customer_rank=1 cuando se crea desde una orden de venta."""
        if self.env.context.get('default_customer_rank'):
            for vals in vals_list:
                if not vals.get('customer_rank'):
                    vals['customer_rank'] = self.env.context['default_customer_rank']
        return super().create(vals_list)