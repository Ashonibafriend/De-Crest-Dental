#!/usr/bin/env python3
import os
import json
import shutil
import re

def get_icon_svg(icon):
    if icon.strip().startswith("<svg"):
        return icon
        
    icons = {
        "shield-check": '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 22px; height: 22px;"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
        "clock": '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 22px; height: 22px;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
        "sparkles": '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 22px; height: 22px;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" /></svg>',
        "wrench": '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 22px; height: 22px;"><path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.65 2.65 0 0021 17.25l-5.83-5.83m-3.75 3.75L6.25 10A2.65 2.65 0 012.5 13.75L8.33 19.58m3.09-4.41L12 14.25" /></svg>',
        "adjustments": '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 22px; height: 22px;"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25" /></svg>',
        "scissors": '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 22px; height: 22px;"><path stroke-linecap="round" stroke-linejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25" /></svg>',
        "user-group": '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 22px; height: 22px;"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75" /></svg>',
        "pencil": '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 22px; height: 22px;"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 21l5.096-.813a2 2 0 001.414-.586l6.903-6.903a2 2 0 000-2.828l-4.243-4.243" /></svg>'
    }
    return icons.get(icon, icons["shield-check"])

def build_site():
    print("Initializing template build...")
    
    # Load configuration
    if not os.path.exists("config.json"):
        print("Error: config.json not found!")
        return
        
    with open("config.json", "r", encoding="utf-8") as f:
        config = json.load(f)
        
    # Create build directory
    build_dir = "dist"
    if os.path.exists(build_dir):
        shutil.rmtree(build_dir)
    os.makedirs(build_dir)
    
    # Generate HTML lists dynamic fragments
    hmo_html = ""
    for hmo in config.get("hmos", []):
        hmo_html += f'              <div class="hmo-card" aria-label="{hmo} HMO"><span>{hmo}</span></div>\n'
        
    services_html = ""
    for idx, svc in enumerate(config.get("services", [])):
        stagger_idx = idx + 1
        icon_svg = get_icon_svg(svc.get("icon", "shield-check"))
        services_html += f"""
          <!-- Service {stagger_idx}: {svc['title']} -->
          <div class="service-card-v8 reveal-scale stagger-{stagger_idx}">
            <div class="service-icon-v8" aria-hidden="true">
              {icon_svg}
            </div>
            <h3 class="service-title-v8">{svc['title']}</h3>
            <p class="service-desc-v8">{svc['shortDesc']}</p>
            <button type="button" class="service-btn-v8" data-service-index="{idx}">Learn More &rarr;</button>
          </div>"""
          
    doctors_html = ""
    for idx, doc in enumerate(config.get("doctors", [])):
        stagger_idx = idx + 1
        reveal_class = "reveal-left" if idx % 3 == 0 else ("reveal-scale" if idx % 3 == 1 else "reveal-right")
        doctors_html += f"""
          <!-- Dentist {stagger_idx}: {doc['name']} -->
          <div class="dentist-card {reveal_class} stagger-{stagger_idx}">
            <div class="dentist-photo-frame">
              <img src="{doc['image']}" alt="{doc['name']}, {doc['degree']}">
            </div>
            <div class="dentist-info-box">
              <h3 class="dentist-name">{doc['name']}</h3>
              <span class="dentist-degree">{doc['degree']}</span>
              <p class="dentist-bio">
                {doc['shortBio']}
              </p>
              <div class="dentist-footer-row" style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: var(--space-xs);">
                <span class="dentist-meta-badge">{doc['specialty']}</span>
                <button type="button" class="btn btn-secondary dentist-detail-btn" data-dentist-index="{idx}" style="padding: 0.35rem 0.75rem; font-size: 0.78rem;">View Bio</button>
              </div>
            </div>
          </div>"""
          
    faqs_html = ""
    for idx, faq in enumerate(config.get("faqs", [])):
        faq_idx = idx + 1
        faqs_html += f"""
          <!-- Q{faq_idx}: {faq['question']} -->
          <div class="faq-item-v8">
            <button type="button" class="faq-trigger-v8" aria-expanded="false" aria-controls="faq-a-{faq_idx}">
              {faq['question']}
              <span class="faq-icon-box-v8" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" style="width: 16px; height: 16px;">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </span>
            </button>
            <div id="faq-a-{faq_idx}" class="faq-content-v8">
              <p>
                {faq['answer']}
              </p>
            </div>
          </div>"""

    # Read templates
    with open("index.html.template", "r", encoding="utf-8") as f:
        html = f.read()
    with open("index.css.template", "r", encoding="utf-8") as f:
        css = f.read()
    with open("index.js.template", "r", encoding="utf-8") as f:
        js = f.read()
        
    # Replacements dictionary
    replacements = {
        "{{CLINIC_NAME}}": config.get("clinic_name", ""),
        "{{CLINIC_SHORT_NAME}}": config.get("short_name", ""),
        "{{CLINIC_PHONE}}": config.get("phone", ""),
        "{{CLINIC_PHONE_FORMATTED}}": config.get("phone_formatted", ""),
        "{{CLINIC_EMAIL}}": config.get("email", ""),
        "{{CLINIC_ADDRESS}}": config.get("address", ""),
        "{{CLINIC_ADDRESS_SHORT}}": config.get("address_short", ""),
        "{{CLINIC_CITY}}": config.get("city", ""),
        "{{CLINIC_REGION}}": config.get("region", ""),
        "{{CLINIC_POSTAL_CODE}}": config.get("postal_code", ""),
        "{{CLINIC_COUNTRY_CODE}}": config.get("country_code", ""),
        "{{GEO_LATITUDE}}": config.get("geo_latitude", ""),
        "{{GEO_LONGITUDE}}": config.get("geo_longitude", ""),
        "{{CAL_COM_LINK}}": config.get("cal_com_link", ""),
        "{{ORIGIN_URL}}": config.get("origin_url", ""),
        "{{HERO_DESCRIPTION}}": config.get("hero_description", ""),
        "{{MAP_IFRAME_SRC}}": config.get("map_iframe_src", ""),
        
        "{{THEME_PRIMARY}}": config.get("theme", {}).get("primary", "#0891b2"),
        "{{THEME_PRIMARY_RGB}}": config.get("theme", {}).get("primary_rgb", "8, 145, 178"),
        "{{THEME_PRIMARY_HOVER}}": hex_hover_color(config.get("theme", {}).get("primary", "#0891b2")),
        "{{THEME_CTA}}": config.get("theme", {}).get("cta", "#059669"),
        "{{THEME_CTA_HOVER}}": hex_hover_color(config.get("theme", {}).get("cta", "#059669")),
        "{{THEME_BRAND_COLOR}}": config.get("theme", {}).get("brand_color", "#005eb1"),
        
        "{{SOCIAL_FACEBOOK}}": config.get("socials", {}).get("facebook", "#"),
        "{{SOCIAL_INSTAGRAM}}": config.get("socials", {}).get("instagram", "#"),
        "{{SOCIAL_TWITTER}}": config.get("socials", {}).get("twitter", "#"),
        
        "{{HOURS_WEEKDAYS}}": config.get("hours", {}).get("weekdays", "Monday - Saturday"),
        "{{HOURS_SPAN}}": config.get("hours", {}).get("hours_span", "9:00 AM - 5:30 PM"),
        "{{HOURS_SUNDAY}}": config.get("hours", {}).get("sunday", "Closed"),
        
        "{{HMO_CARDS_HTML}}": hmo_html,
        "{{SERVICES_HTML}}": services_html,
        "{{DOCTORS_HTML}}": doctors_html,
        "{{FAQS_HTML}}": faqs_html,
        
        "{{SERVICES_DATA_JSON}}": json.dumps(format_services_data(config.get("services", [])), indent=2),
        "{{TESTIMONIALS_JSON}}": json.dumps(config.get("testimonials", []), indent=2),
        "{{DOCTORS_JSON}}": json.dumps(format_doctors_data(config.get("doctors", [])), indent=2)
    }
    
    # Process replacements in files
    for placeholder, val in replacements.items():
        html = html.replace(placeholder, str(val))
        css = css.replace(placeholder, str(val))
        js = js.replace(placeholder, str(val))
        
    # Write compiled outputs
    with open(os.path.join(build_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(html)
    with open(os.path.join(build_dir, "index.css"), "w", encoding="utf-8") as f:
        f.write(css)
    with open(os.path.join(build_dir, "index.js"), "w", encoding="utf-8") as f:
        f.write(js)
        
    # Copy images if they exist locally
    parent_files = os.listdir("..")
    image_extensions = (".png", ".jpg", ".jpeg", ".svg", ".webp", ".gif", ".ico")
    for filename in parent_files:
        if filename.lower().endswith(image_extensions):
            shutil.copy(os.path.join("..", filename), os.path.join(build_dir, filename))
            
    print("Build complete! Files written to template/dist/")

def hex_hover_color(hex_val):
    # Generates a slightly darker shade for hover states
    hex_val = hex_val.lstrip("#")
    if len(hex_val) != 6:
        return f"#{hex_val}"
    try:
        rgb = tuple(int(hex_val[i:i+2], 16) for i in (0, 2, 4))
        darkened = tuple(max(0, int(c * 0.85)) for c in rgb)
        return "#" + "".join(f"{c:02x}" for c in darkened)
    except ValueError:
        return f"#{hex_val}"

def format_services_data(services):
    res = []
    for svc in services:
        icon_svg = get_icon_svg(svc.get("icon", "shield-check"))
        res.append({
            "title": svc["title"],
            "desc": svc["fullDesc"],
            "price": svc["price"],
            "iconHtml": icon_svg
        })
    return res

def format_doctors_data(doctors):
    res = []
    for doc in doctors:
        res.append({
            "name": doc["name"],
            "degree": doc["degree"],
            "bio": doc["fullBio"],
            "approach": doc["approach"],
            "hours": doc["hours"],
            "img": doc["image"]
        })
    return res

if __name__ == "__main__":
    build_site()
