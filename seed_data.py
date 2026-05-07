"""
ALGERIA WANDER — Seed Data Script
===================================
- Inserts places for: Oran, Béjaïa, Annaba, Djanet
- Alger already added manually — skipped
- Uses get_or_create — never deletes existing data
- Categories must already exist: Events, Hotels, Landmarks, Restaurants, Museum

Run with:
    python manage.py shell < seed_data.py
"""

import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wander_project.settings')
django.setup()

from core.models import Wilaya, Category, Place

# ══════════════════════════════════════════════
#  LOAD EXISTING CATEGORIES
# ══════════════════════════════════════════════
print("Loading categories...")
cat = {}
for nom in ["Events", "Hotels", "Landmarks", "Restaurants", "Museum"]:
    try:
        cat[nom] = Category.objects.get(nom=nom)
        print(f"  ✓ Found: {nom}")
    except Category.DoesNotExist:
        print(f"  ✗ NOT FOUND: '{nom}' — make sure this category exists in your admin!")

# ══════════════════════════════════════════════
#  DATA
# ══════════════════════════════════════════════
data = [

    # ══════════════════════════════════════════
    #  ORAN
    # ══════════════════════════════════════════
    {
        "wilaya": "Oran",
        "places": [
            {
                "nom": "Fort Santa Cruz",
                "description": "Crowning the summit of the Murdjadjo Mountain, Fort Santa Cruz is the most dramatic landmark in Oran, visible from virtually anywhere in the city. Built by the Spanish in the 16th century and later expanded by the Ottomans, the fortress is a formidable complex of ramparts, towers, and cisterns that once guarded the city from both sea and land. The road up winds through fragrant scrubland, rewarding those who reach the top with jaw-dropping panoramic views of the entire Bay of Oran and the sprawling city below. Adjacent to the fort stands the Chapel of Santa Cruz, a small whitewashed church that remains a place of quiet contemplation.",
                "adresse": "Murdjadjo Mountain, Oran",
                "category": "Landmarks",
                "horaires_ouverture": "Daily 8:00–18:00",
            },
            {
                "nom": "Great Mosque of Oran — Mosquée du Bey",
                "description": "One of the finest examples of Ottoman-Algerian religious architecture, the Great Mosque of Oran was built in 1796 under Bey Mohammed El Kebir. Its elegant minaret rises above the old city quarter, and the interior is a masterpiece of zellige tilework, carved stucco, and chandelier-lit prayer halls. The surrounding neighborhood still retains much of its 18th-century character, with covered market lanes and traditional craftsmen.",
                "adresse": "Old Oran, Oran",
                "category": "Landmarks",
                "horaires_ouverture": "Open daily except during prayer times",
            },
            {
                "nom": "Place du 1er Novembre",
                "description": "The beating heart of modern Oran, Place du 1er Novembre is a grand colonial square surrounded by the ornate City Hall, the Opera House, and Haussmann-style facades. In the evenings, the square fills with families, street performers, and café-goers. The ornamental fountain at its center and the wide café terraces along its perimeter make it the quintessential Oranese gathering place — the ideal spot to absorb the city's legendary joie de vivre.",
                "adresse": "City Centre, Oran",
                "category": "Landmarks",
                "horaires_ouverture": "Always open",
            },
            {
                "nom": "Palace of the Bey — Dar El Senaa",
                "description": "An opulent 18th-century Ottoman palace, Dar El Senaa was the residence of the Beys who governed western Algeria. Its architecture is a splendid fusion of Ottoman, Andalusian, and Moorish styles: multi-columned reception halls, intricate mosaic floors, carved cedar wood ceilings, and a serene inner garden. Today it houses a museum of regional artifacts, historic weapons, and documents relating to the Ottoman period in western Algeria.",
                "adresse": "Historic Centre, Oran",
                "category": "Museum",
                "horaires_ouverture": "Tuesday–Sunday 9:00–17:00",
            },
            {
                "nom": "Le Terminus",
                "description": "A legendary Oran institution housed in a restored art nouveau building near the old train station. Le Terminus has been serving faithful customers for decades with its unwavering formula: generous French-Algerian cuisine, excellent house wine, and a convivial atmosphere. Their escalope Oranaise — breaded veal with tomato and olive sauce — is the city's unofficial signature dish. Must try: Escalope Oranaise, Moules Marinières, Tarte Tatin.",
                "adresse": "Rue Docteur Benzerdjeb, Oran",
                "category": "Restaurants",
                "horaires_ouverture": "",
            },
            {
                "nom": "Chez Fatma el Wahraniya",
                "description": "A small, no-frills family restaurant run by three generations of the same family, serving the most authentic Oranais home cooking in the city. The daily menu is written on a chalkboard and changes with the market — everything is made from scratch every morning. Their sferia — chickpeas in a rich slow-cooked broth — is reason enough to visit. Must try: Sferia aux Pois Chiches, Chakhchoukha Wahraniya, Kalb el Louz.",
                "adresse": "Quartier Medina Jedida, Oran",
                "category": "Restaurants",
                "horaires_ouverture": "",
            },
            {
                "nom": "La Corniche Seafood & Grill",
                "description": "Perched on the clifftop corniche with a breathtaking view of the bay, this upscale seafood restaurant is the place to go for a celebratory meal in Oran. Fresh daily catches are displayed on ice at the entrance — you choose your fish, and the chef does the rest. Must try: Daurade Grillée Chermoula, Pastilla de Fruits de Mer, Salade Wakame.",
                "adresse": "Boulevard de la Corniche, Oran",
                "category": "Restaurants",
                "horaires_ouverture": "",
            },
            {
                "nom": "Le Méridien Oran Hotel & Convention Centre",
                "description": "Oran's premier five-star luxury property, the Méridien commands spectacular views of the Mediterranean from its clifftop location. With 250 rooms and suites, a large outdoor pool, a world-class spa, and multiple dining outlets, it sets the standard for luxury hospitality in western Algeria. The rooftop bar is the city's most glamorous cocktail destination. Highlights: Sea views, rooftop pool & bar, full spa, convention facilities.",
                "adresse": "Plateau de Canastel, Oran",
                "category": "Hotels",
                "horaires_ouverture": "Open 24/7",
            },
            {
                "nom": "Grand Hôtel d'Oran",
                "description": "A beautifully restored colonial-era hotel occupying a prime position on the main square. The Grand Hôtel d'Oran blends art nouveau architecture with contemporary Algerian interior design. High ceilings, mosaic floors, and a spectacular central staircase greet guests. The rooftop terrace offers views over the square and old city. Highlights: Prime central location, heritage architecture, rooftop terrace, excellent breakfast.",
                "adresse": "Place du 1er Novembre, Oran",
                "category": "Hotels",
                "horaires_ouverture": "Open 24/7",
            },
            {
                "nom": "Hôtel Royal Oran",
                "description": "A reliable and comfortable budget option in a convenient central location. Rooms are clean and well-maintained, with a cheerful staff that embodies Oran's famous hospitality. A solid breakfast buffet, secure parking, and proximity to the main sights make it an excellent base for exploring the city. Highlights: Central location, good value, secure parking, friendly staff.",
                "adresse": "Rue Khemisti, Oran",
                "category": "Hotels",
                "horaires_ouverture": "Open 24/7",
            },
            {
                "nom": "Festival International de Raï d'Oran",
                "description": "A celebration of raï — the genre born in the streets of Oran — this three-day international festival transforms the city into a giant concert venue. Artists from Algeria, France, Morocco, and beyond perform across multiple outdoor stages in the city center. The festival draws tens of thousands of fans and ends with a massive free concert at the seafront amphitheater.",
                "adresse": "Place de la Bastille & Waterfront Amphitheater, Oran",
                "category": "Events",
                "horaires_ouverture": "August — 3 days",
            },
            {
                "nom": "Journées Culturelles du Patrimoine Oranais",
                "description": "A four-day festival celebrating the rich cultural heritage of the Oran region. Events include traditional music performances inside the Dar El Senaa palace, craft exhibitions of Oranais embroidery and ceramics, cooking demonstrations of traditional dishes, and guided heritage walks through the historic neighborhoods. Free entry to all city museums during the festival days.",
                "adresse": "Various historic venues, Oran",
                "category": "Events",
                "horaires_ouverture": "April — 4 days",
            },
        ]
    },

    # ══════════════════════════════════════════
    #  BÉJAÏA
    # ══════════════════════════════════════════
    {
        "wilaya": "Bejaia",
        "places": [
            {
                "nom": "Gouraya National Park & Summit",
                "description": "Looming directly above the city, the Gouraya Mountain and its national park form one of Algeria's most spectacular natural settings. Declared a national park in 1984, Gouraya protects dense cedar and oak forests, dramatic limestone cliffs plunging into the sea, hidden coves accessible only by boat, and a rich wildlife including the rare Barbary macaque monkey. The park has numerous hiking trails of varying difficulty and is a paradise for birdwatchers and nature lovers.",
                "adresse": "Gouraya, Béjaïa",
                "category": "Landmarks",
                "horaires_ouverture": "Park always open; fort daily 8:00–17:00",
            },
            {
                "nom": "Fort Moussa",
                "description": "Standing at the tip of Gouraya's headland like a stone sentinel over the sea, Fort Moussa is a layered historical monument that was built, destroyed, and rebuilt by successive rulers — Romans, Hammadids, Spanish, Ottomans, and French. Its walls enclose the ruins of multiple periods of occupation, and the views from its ramparts over the sea and the city below are among the most dramatic in Algeria.",
                "adresse": "Gouraya, Béjaïa",
                "category": "Landmarks",
                "horaires_ouverture": "Daily 8:00–17:00",
            },
            {
                "nom": "Cap Carbon",
                "description": "A wild and windswept headland at the edge of the Gouraya massif, Cap Carbon is one of the most dramatic natural landmarks on the Algerian coast. The cape's lighthouse — perched atop sheer cliffs that drop directly into the Mediterranean — has guided sailors for over a century. The view from the cliff edge, looking out at the infinite blue Mediterranean with the forested mountains behind, is genuinely awe-inspiring.",
                "adresse": "Cap Carbon, Béjaïa",
                "category": "Landmarks",
                "horaires_ouverture": "Always accessible; lighthouse exterior only",
            },
            {
                "nom": "Historic Port & Medina of Béjaïa",
                "description": "Béjaïa's ancient port has been a hub of Mediterranean trade for over 2,000 years. The area around the old port retains much of its historic character, with Ottoman-era gates and the remains of Hammadid-period walls. This is also where the Italian mathematician Fibonacci learned the Hindu-Arabic numeral system from Arab traders — a commemorative plaque marks this historic importance to global mathematics.",
                "adresse": "Port de Béjaïa, Béjaïa",
                "category": "Landmarks",
                "horaires_ouverture": "Market daily except Friday mornings",
            },
            {
                "nom": "Le Goéland",
                "description": "Named after the seagull and positioned with a view of the harbor, Le Goéland is the finest seafood restaurant in Béjaïa. The menu celebrates local fishing traditions: grilled octopus, sea urchin pasta, whole stuffed squid, and a remarkable fish soup that locals claim rivals anything in Marseille. Must try: Soupe de Poisson Kabyle, Poulpe Grillé, Oursins de Saison.",
                "adresse": "Boulevard des Aurès, Béjaïa",
                "category": "Restaurants",
                "horaires_ouverture": "",
            },
            {
                "nom": "Taddart — Maison de la Cuisine Kabyle",
                "description": "A warmly decorated restaurant dedicated entirely to the traditional cuisine of the Kabyle people. Dishes are made using ancestral recipes: azeqqi (dried figs and nuts), tisilt (barley couscous), and lamb spit-roasted over olive wood. The handmade pottery, Kabyle carpets, and embroidered tablecloths make the dining room feel like an ethnographic museum. Must try: Couscous Kabyle au Beurre Rance, Azeqqi, Agneau au Four.",
                "adresse": "Route des Aurès, Béjaïa",
                "category": "Restaurants",
                "horaires_ouverture": "",
            },
            {
                "nom": "Brasserie du Port",
                "description": "A casual but charming café-restaurant right on the working port. The simple daily menu depends on what the fishing boats bring in — the freshest possible grilled fish, shrimp, and mussels. In the morning, it doubles as a popular breakfast spot for dock workers and early-rising tourists, with excellent coffee and msemen flatbreads. Must try: Moules du Jour, Poisson Grillé du Pêcheur, Msemen au Miel.",
                "adresse": "Quai du Port, Béjaïa",
                "category": "Restaurants",
                "horaires_ouverture": "",
            },
            {
                "nom": "Hôtel Gouraya",
                "description": "Spectacularly positioned on the mountainside above the city, Hôtel Gouraya offers panoramic views of the bay and the Gulf of Béjaïa from every room. Rooms are decorated in a contemporary Kabyle style with natural wood and local textiles. The outdoor terrace restaurant is magical in the evenings, with the city lights below and the stars above. Highlights: Panoramic bay views, mountain setting, outdoor pool, Kabyle-inspired décor.",
                "adresse": "Route Touristique, Béjaïa",
                "category": "Hotels",
                "horaires_ouverture": "Open 24/7",
            },
            {
                "nom": "Les Hammadites Hotel",
                "description": "A reliable and centrally located three-star hotel, the Hammadites is popular with business travelers and tourists alike. Rooms are comfortable and functional, and the rooftop breakfast terrace offers surprising views over the city toward the mountains. Good value and excellent proximity to the port and shopping areas. Highlights: Central location, rooftop breakfast, comfortable rooms, good value.",
                "adresse": "Avenue de la Soummam, Béjaïa",
                "category": "Hotels",
                "horaires_ouverture": "Open 24/7",
            },
            {
                "nom": "Festival des Arts et de la Culture Amazighe",
                "description": "An annual celebration of Amazigh (Berber) culture held over five days in Béjaïa. The festival showcases Kabyle poetry, traditional music (including tifrer and ahellil chants), contemporary Amazigh-language films, craft exhibitions, and a major open-air concert on the last night. The event brings together Berber artists and cultural figures from across North Africa.",
                "adresse": "Maison de la Culture, Béjaïa",
                "category": "Events",
                "horaires_ouverture": "June — 5 days",
            },
            {
                "nom": "Fête de la Mer — Festival des Pêcheurs",
                "description": "A two-day festival celebrating Béjaïa's deep connection to the sea. Fishing boats decorated with flags and colored lights parade across the harbor at sunset, followed by a communal feast on the quay featuring grilled fish, seafood stews, and traditional Kabyle bread. Live music, folk dances, and boat races round out the festivities.",
                "adresse": "Port de Béjaïa, Béjaïa",
                "category": "Events",
                "horaires_ouverture": "July — 2 days",
            },
        ]
    },

    # ══════════════════════════════════════════
    #  ANNABA
    # ══════════════════════════════════════════
    {
        "wilaya": "Annaba",
        "places": [
            {
                "nom": "Hippo Regius Archaeological Site",
                "description": "One of the most important archaeological sites in North Africa, Hippo Regius was a major Roman city that flourished from the 2nd century BC through the 5th century AD. Its ruins reveal a remarkably preserved forum, mosaic-floored villas, public baths, a basilica, and a theater. Saint Augustine served as bishop here from 396 to 430 AD. A monumental bronze statue of Augustine stands before the adjacent basilica, gazing out over the ruins of his city.",
                "adresse": "Hippone, Annaba",
                "category": "Landmarks",
                "horaires_ouverture": "Tuesday–Sunday 9:00–17:00",
            },
            {
                "nom": "Basilique Saint-Augustin",
                "description": "Perched on a hilltop with commanding views over Annaba and the sea, the Basilique Saint-Augustin is a late 19th-century neo-Byzantine church built by French architects. Its interior houses a relic of Saint Augustine brought from Pavia, Italy, in 1842. The basilica is still an active place of pilgrimage and worship, drawing visitors from around the world who come to honor Augustine — one of history's greatest intellectual figures — in the city where he lived and died.",
                "adresse": "Hippone Hill, Annaba",
                "category": "Landmarks",
                "horaires_ouverture": "Daily 7:00–19:00",
            },
            {
                "nom": "La Corniche d'Annaba",
                "description": "Annaba is blessed with some of the finest beaches in Algeria. The corniche — a winding coastal road flanked by pine trees and golden sandy beaches — is where the city comes to breathe. The stretch between the Seraïdi resort hills and the city beaches is particularly stunning, with clear turquoise water and rocky headlands. The beaches of Chapuis and El Battah are especially popular with locals and tourists alike.",
                "adresse": "Corniche, Annaba",
                "category": "Landmarks",
                "horaires_ouverture": "Always accessible; beaches free of charge",
            },
            {
                "nom": "Restaurant Le Phenix",
                "description": "One of Annaba's most beloved restaurants, Le Phenix has been feeding the city since the 1980s. Specializing in local seafood caught fresh from the Gulf of Annaba and served with traditional Algerian sauces, their signature dish — red mullet stuffed with chermoula and roasted in the wood oven — is the stuff of local legend. Must try: Rouget Farci Chermoula, Chorba de Pêcheur, Baklawa Maison.",
                "adresse": "Rue du 1er Novembre, Annaba",
                "category": "Restaurants",
                "horaires_ouverture": "",
            },
            {
                "nom": "La Pergola d'Hippone",
                "description": "Located near the Hippo Regius ruins, La Pergola serves upscale Algerian and Mediterranean food in a shaded garden setting that feels like a Roman villa. Perfect for a long post-ruins lunch. Lamb tagines, homemade pasta, and a remarkable vine-shaded terrace make it a memorable experience. Must try: Tagine d'Agneau aux Abricots, Linguine Annabie, Crème Brûlée au Miel.",
                "adresse": "Route Archéologique, Annaba",
                "category": "Restaurants",
                "horaires_ouverture": "",
            },
            {
                "nom": "Café des Arcades",
                "description": "An iconic Art Deco café under the arched colonnade of Annaba's central square. The perfect place to start the day with a café noisette and a warm croissant, or to stop mid-afternoon for a glass of lemonade. Locals have been meeting here under the arcades for generations. Must try: Café Noisette, Frigga au Citron, Baghrir avec Miel.",
                "adresse": "Place Ibn Khaldoun, Annaba",
                "category": "Restaurants",
                "horaires_ouverture": "",
            },
            {
                "nom": "Hôtel Seybouse International",
                "description": "The classic address in Annaba, a four-star property in the heart of the city with spacious, well-furnished rooms and attentive service. Its position on the main square gives guests immediate access to the city's best shops, cafés, and cultural sites. The rooftop restaurant with views over the city is a highlight. Highlights: Prime central location, rooftop restaurant, business facilities, excellent service.",
                "adresse": "Place du 1er Novembre, Annaba",
                "category": "Hotels",
                "horaires_ouverture": "Open 24/7",
            },
            {
                "nom": "Hôtel Rym Beach",
                "description": "A comfortable beachside hotel set in pine-shaded grounds along the corniche, ideal for those who want the sea at their doorstep. Rooms have balconies, many with sea views. The hotel has private beach access, an outdoor pool, and a casual seafood restaurant. A very popular choice in summer. Highlights: Direct beach access, outdoor pool, sea-view balconies, pine garden.",
                "adresse": "Corniche Seraïdi, Annaba",
                "category": "Hotels",
                "horaires_ouverture": "Open 24/7",
            },
            {
                "nom": "Festival International de la Musique Classique d'Annaba",
                "description": "An annual classical music festival held in the historic Theatre de Annaba, attracting orchestras and soloists from Algeria, France, Italy, and beyond. Over five evenings, concerts ranging from chamber music to full orchestral performances fill the beautifully restored art deco theatre. The event honors Annaba's deep connection to Saint Augustine.",
                "adresse": "Théâtre Régional d'Annaba, Annaba",
                "category": "Events",
                "horaires_ouverture": "May — 5 evenings",
            },
            {
                "nom": "Journées d'Hippone — Festival Archéologique",
                "description": "A unique annual event that brings the ruins of Hippo Regius to life. Actors in period costume recreate scenes from Roman and early Christian life among the ancient stones. Academic lectures, guided night tours of the ruins, and a reenactment of a Roman market make this a fascinating event for history enthusiasts of all ages.",
                "adresse": "Site Archéologique de Hippone, Annaba",
                "category": "Events",
                "horaires_ouverture": "September",
            },
        ]
    },

    # ══════════════════════════════════════════
    #  DJANET
    # ══════════════════════════════════════════
    {
        "wilaya": "Djanet",
        "places": [
            {
                "nom": "Tassili n'Ajjer National Park",
                "description": "A UNESCO World Heritage Site covering over 72,000 square kilometers — a geological and cultural wonder unlike anything else on the planet. The Tassili plateau is a labyrinth of ancient sandstone formations: soaring natural arches, narrow canyons, and forests of petrified rock. Most astonishing are the prehistoric rock paintings and engravings — over 15,000 documented works spanning 12,000 years — depicting savannah wildlife and human scenes from an era when the Sahara was green and fertile.",
                "adresse": "Tassili n'Ajjer, Djanet",
                "category": "Landmarks",
                "horaires_ouverture": "Year-round; October–April is the ideal season",
            },
            {
                "nom": "Tin Akachaker Rock Arch",
                "description": "Among the most photographed natural formations in all of Africa, the Tin Akachaker arch is a massive sandstone natural bridge rising from the desert plateau with a span of over 30 meters. At sunrise and sunset, the arch glows in shades of deep orange, red, and gold against the limitless blue of the Saharan sky. One of the defining experiences of travel in Algeria.",
                "adresse": "Tassili n'Ajjer, Djanet",
                "category": "Landmarks",
                "horaires_ouverture": "Accessible year-round with a licensed guide",
            },
            {
                "nom": "Old Djanet — Aggour & Adjahil Quarters",
                "description": "The old quarters of Djanet are a remarkable example of Saharan vernacular architecture. Tall, fortress-like houses made of mud-brick, palm timber, and gypsum plaster rise in compact clusters within the palm grove, providing natural insulation against the extreme desert heat. Walking through the old town with a local Tuareg guide reveals the deep traditions of this ancient oasis community.",
                "adresse": "Old Djanet, Djanet",
                "category": "Landmarks",
                "horaires_ouverture": "Always accessible; market most active on Thursdays",
            },
            {
                "nom": "Oued Iherir — Hidden Saharan Oasis",
                "description": "One of the most magical places in the entire Sahara, Oued Iherir is a hidden canyon oasis where freshwater gueltas (pools) nestle between towering sandstone walls. Fed by underground springs, the gueltas support a lush strip of date palms and reeds. The pools are home to the critically endangered Saharan crocodile, a relict population that has survived here since the Sahara was wet and fertile.",
                "adresse": "Oued Iherir, Djanet",
                "category": "Landmarks",
                "horaires_ouverture": "Accessible year-round with a licensed guide",
            },
            {
                "nom": "Tinfariwen — Restaurant du Désert",
                "description": "Djanet's most celebrated dining spot — a low-roofed, carpet-strewn space where guests eat cross-legged on cushions and are served by hosts in full Tuareg dress. The menu is rooted in authentic nomadic desert cuisine: taguella (Tuareg bread baked under hot sand and embers), lamb cooked in a buried clay pot, dates and dried figs, and the intensely sweet Tuareg mint tea served in three progressively sweeter rounds. Must try: Taguella avec Beurre de Chamelle, Agneau au Feu de Bois, Thé à la Menthe Touareg.",
                "adresse": "Centre-Ville, Djanet",
                "category": "Restaurants",
                "horaires_ouverture": "",
            },
            {
                "nom": "Le Guelta",
                "description": "A simple, honest restaurant that serves reliable Algerian food to travelers arriving from or departing on long desert expeditions. The harira is thick and restorative, the merguez is grilled to perfection, and the couscous with braised lamb has fueled countless Saharan adventures. A great place to eat before a three-day trek into Tassili. Must try: Harira, Couscous Sahraoui, Merguez Grillée.",
                "adresse": "Route de l'Aéroport, Djanet",
                "category": "Restaurants",
                "horaires_ouverture": "",
            },
            {
                "nom": "Hôtel Zeriba",
                "description": "The most atmospheric hotel in Djanet, built in the traditional Tuareg palm-frond and mud-brick style. Rooms open onto a central sandy courtyard shaded by enormous palms, and the stargazing from the rooftop terrace under the Saharan sky — with virtually zero light pollution — is genuinely life-changing. The hotel organizes desert excursions, camel treks, and guided tours into Tassili. Highlights: Tuareg architecture, exceptional stargazing terrace, desert excursion packages.",
                "adresse": "Route Touristique, Djanet",
                "category": "Hotels",
                "horaires_ouverture": "Open 24/7",
            },
            {
                "nom": "Tadrart Camp & Lodge",
                "description": "A beautifully run desert camp-lodge at the edge of the palm oasis, offering a choice between comfortable lodge rooms and traditional Tuareg goat-hair tents under the stars. The lodge's guides are all local Tuareg with decades of experience in Tassili and the surrounding desert. Perfect for travelers who want comfort as a base while immersing in the desert experience. Highlights: Oasis setting, Tuareg tent option, experienced local guides.",
                "adresse": "Oasis de Djanet, Djanet",
                "category": "Hotels",
                "horaires_ouverture": "Open 24/7",
            },
            {
                "nom": "Festival du Tassili — Sebiba de Djanet",
                "description": "The Sebiba is the most sacred and spectacular traditional festival of the Tuareg people of Djanet, held annually over two days during the Islamic New Year period. Warriors in full indigo robes and silver jewelry perform sword dances, chant poetry, and parade on camels, while musicians play the imzad (a single-stringed Tuareg violin). One of the most authentic and visually extraordinary traditional festivals in all of North Africa.",
                "adresse": "Place de la Sebiba, Old Djanet",
                "category": "Events",
                "horaires_ouverture": "Muharram (Islamic New Year) — 2 days",
            },
            {
                "nom": "Nuit des Étoiles du Sahara",
                "description": "A three-day festival celebrating the extraordinary skies of the Sahara, organized in partnership with astronomy associations from Algiers and France. Participants camp under the stars in the desert guided by expert astronomers with high-powered telescopes. Daytime activities include guided walks to prehistoric rock art sites and Tuareg music performances around campfires.",
                "adresse": "Desert camp, Djanet — Tassili n'Ajjer foothills",
                "category": "Events",
                "horaires_ouverture": "October — 3 days",
            },
        ]
    },
]


# ══════════════════════════════════════════════
#  INSERT INTO DATABASE
# ══════════════════════════════════════════════
print("\nInserting places...")

for entry in data:
    wilaya_nom = entry["wilaya"]

    try:
        wilaya_obj = Wilaya.objects.get(nom=wilaya_nom)
        print(f"\n  → Wilaya found: {wilaya_obj.nom}")
    except Wilaya.DoesNotExist:
        print(f"\n  ✗ Wilaya NOT FOUND: '{wilaya_nom}' — skipping!")
        continue

    for p in entry["places"]:
        category_nom = p["category"]
        if category_nom not in cat:
            print(f"    ✗ Category '{category_nom}' not found — skipping: {p['nom']}")
            continue

        place_obj, created = Place.objects.get_or_create(
            nom=p["nom"],
            defaults={
                "description": p["description"],
                "adresse": p["adresse"],
                "wilaya": wilaya_obj,
                "category": cat[category_nom],
                "horaires_ouverture": p.get("horaires_ouverture", ""),
            }
        )
        status = "✓ added" if created else "→ already exists"
        print(f"    {status} : {p['nom']}")


print("\n" + "="*55)
print(f"DONE!")
print(f"  Total Wilayas    : {Wilaya.objects.count()}")
print(f"  Total Categories : {Category.objects.count()}")
print(f"  Total Places     : {Place.objects.count()}")
print("="*55)
print("\n→ Go to http://127.0.0.1:8000/admin to check your data!")
