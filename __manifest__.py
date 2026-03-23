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
}