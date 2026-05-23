import os

filepath = 'index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

css_to_add = """
    /* MOBILE REDESIGN CSS */
    .mobile-header { display: none !important; }
    .desktop-header { display: flex !important; }
    .mobile-greeting { display: none !important; }
    
    @media (max-width: 768px) {
      .desktop-header {
        display: none !important;
      }
      .mobile-header {
        display: flex !important;
      }
      .mobile-greeting {
        display: block !important;
      }
      /* Sidebar toggle logic on mobile */
      #sidebar.mobile-open {
        left: 0 !important;
        box-shadow: 20px 0 50px rgba(0,0,0,0.5) !important;
      }
    }
"""

if "/* MOBILE REDESIGN CSS */" not in content:
    new_content = content.replace("</style>", css_to_add + "\n  </style>")
    with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
        f.write(new_content)
    print("Success: Injected CSS.")
else:
    print("CSS already injected.")
