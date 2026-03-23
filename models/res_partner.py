# -*- coding: utf-8 -*-
from odoo import api, models, _
from odoo.exceptions import UserError


class ResPartner(models.Model):
    _inherit = "res.partner"

    @api.model
    def name_create(self, name):
        if self.env.context.get("from_sale_order"):
            raise UserError(_(
                "Para crear un nuevo contacto, utilice la opción "
                "'Crear y editar...' del menú desplegable."
            ))
        return super().name_create(name)