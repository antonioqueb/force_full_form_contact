{
    "name": "Force Full Form for Contact Creation",
    "version": "19.0.1.0.0",
    "category": "Sales",
    "summary": "Hides quick-create for contacts, forces Create and Edit",
    "description": """
Hides the 'Crear "X"' quick-create dropdown option for partner fields.
Only 'Crear y editar...' remains available. If quick-create is triggered
by other means, a friendly error message is shown.
    """,
    "author": "Alphaqueb Consulting",
    "website": "https://alphaqueb.com",
    "license": "LGPL-3",
    "depends": ["sale", "purchase"],
    "assets": {
        "web.assets_backend": [
            "force_full_form_contact/static/src/css/hide_quick_create.css",
            "force_full_form_contact/static/src/js/many2one_force_form.js",
        ],
    },
    "installable": True,
    "auto_install": False,
}