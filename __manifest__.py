{
    "name": "Force Full Form for Contact Creation",
    "version": "19.0.1.0.0",
    "category": "Sales",
    "summary": "Disables quick-create for partners and forces full form view on Create and Edit",
    "description": """
        - Disables quick-create (typing name and pressing Enter) for partner fields
          in Sale Orders and Purchase Orders.
        - Forces 'Create and Edit' to open the full contact form instead of a popup dialog.
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
}
