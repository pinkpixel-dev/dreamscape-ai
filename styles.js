// Style definitions for image generation prompts
const STYLE_PROMPTS = {
    "none": {
        "name": "None",
        "description": "No style modification",
        "prompt": ""
    },
    "detailed": {
        "name": "Detailed",
        "description": "Hyper-detailed visual description",
        "prompt": "rendered as hyper-detailed with precise technical specifications including lighting (key light at 45 degrees, fill light at 30% intensity, rim light for depth), composition (rule of thirds, dynamic balance, leading lines), texture details (surface qualities at macro level, material properties with 90% accuracy), atmospheric elements (volumetric lighting, particle effects at 20% density), and depth of field (selective focus with f/2.8 aperture simulation, bokeh effects at 40% intensity). Include specific color grading (natural color temperature at 5600K, controlled saturation at 85%, highlights preserved at 95%) and environmental details (ambient occlusion at 30% strength, subtle color bleeding between surfaces)"
    },
    "photorealistic": {
        "name": "Photorealistic",
        "description": "Hyperdetailed photorealistic image",
        "prompt": "rendered as a hyperrealistic photorealistic photographic image with precise photographic specifications including, but not limited to, camera settings (ISO 100, f/8 aperture, 1/125 shutter speed), lens characteristics (85mm focal length, minimal distortion, edge-to-edge sharpness), lighting setup (three-point lighting with key light at 45 degrees, fill light at 30% power, rim light at 70% power), color accuracy (100% sRGB color space coverage, natural white balance at 5500K), surface details (micro-contrast enhancement, surface texture resolution at 4K equivalent), and post-processing techniques (selective sharpening at 80% radius, highlight recovery at 90%, shadow detail preservation at 85%)"
    },
    "cinematic": {
        "name": "Cinematic",
        "description": "Cinematic shot with dynamic lighting",
        "prompt": "rendered as a cinematic shot with precise specifications: aspect ratio 2.39:1 (CinemaScope), anamorphic lens characteristics (oval bokeh, subtle lens flares at 30% intensity), lighting setup (motivated lighting, key-to-fill ratio 4:1, edge light at 60% intensity), color grading (teal-orange complementary palette, crushed blacks at 5%, highlight retention at 90%), camera movement simulation (subtle dolly motion, 35mm film grain at 15% opacity), depth of field (selective focus with anamorphic characteristics), advanced post-processing (vignette at 20% strength, chromatic aberration at 5%, halation effect for highlights)"
    },
    "artistic": {
        "name": "Artistic",
        "description": "Sophisticated artwork",
        "prompt": "rendered as a sophisticated artwork with specific artistic techniques including brush strokes (varied thickness from 1-20px, directional flow following form, dry brush effects at 40% opacity), color theory application (split-complementary color scheme, temperature contrast with 70% warm to 30% cool ratio), textural elements (impasto technique for highlights, glazing layers at 20% opacity), composition (golden ratio spiral, dynamic balance with 60-40 weight distribution), artistic mediums (oil paint simulation with scumbling technique, palette knife textures at key points), and mood enhancement (atmospheric perspective at 25% strength, emotional color temperature emphasis)"
    },
    "minimalist": {
        "name": "Minimalist",
        "description": "Clean minimalist design",
        "prompt": "rendered as a minimal design with precise specifications including composition (negative space占70%, geometric balance with 3-5 key elements), color palette (maximum 3 colors with 90% pure values, 10% tonal variation), line work (clean edges at 99% precision, purposeful weight variation 1-3px), spatial relationships (mathematical grid system, golden ratio proportions), texture (subtle surface variation at 5% noise, controlled gradient transitions), and design principles (maximum impact with minimum elements, focal point hierarchy with 80-20 rule)"
    },
    "fantasy": {
        "name": "Fantasy",
        "description": "Fantasy-themed magical artwork",
        "prompt": "rendered as a fantasy-themed artwork with specific magical elements including lighting effects (ethereal glow at 60% opacity, magical particles with 30% scatter rate), color schemes (enchanted palette with iridescent highlights, magical aura effects at 40% intensity), atmospheric elements (mystical fog with 25% density, floating magical elements with physics simulation), environmental details (fantasy architecture with golden ratio proportions, magical vegetation with bioluminescence), and otherworldly effects (spell effects with procedural generation, arcane symbols with 90% clarity, magical material properties)"
    },
    "horror": {
        "name": "Horror",
        "description": "Dark horror theme",
        "prompt": "rendered as a dark horror artwork with specific unsettling elements including lighting (high contrast with 90% shadow density, selective highlighting at 10% coverage), atmosphere (volumetric fog at 70% opacity, particle effects for dust/spores at 20% density), texture details (decaying surfaces with procedural noise, organic patterns with 85% unsettling factor), color grading (desaturated palette with selective color emphasis, cool temperature at 4000K), and horror-specific elements (subtle distortions at 15% strength, uncomfortable asymmetry in composition, tension-building negative space)"
    },
    "vaporwave": {
        "name": "Vaporwave",
        "description": "Retro-digital aesthetic",
        "prompt": "rendered as a vaporwave aesthetic with precise retro-digital elements including color palette (neon pink and cyan at 90% saturation, sunset gradients at 80% smoothness), retro elements (1980s and 1990s design at 95% accuracy, glitch effects at 40% intensity), digital artifacts (scan lines at 70% opacity, VHS distortion at 30% strength), spatial elements (infinite grids with perspective, floating geometric shapes), and characteristic elements (ancient sculpture integration, retro technology at 85% authenticity)"
    },
    "pixel_art": {
        "name": "Pixel Art",
        "description": "Precise pixel-based artwork",
        "prompt": "rendered as precise pixel art with specific technical constraints including resolution (limited pixel grid at 32x32 to 128x128, perfect square pixels), color palette (limited to 16-32 colors with precise indexing, dithering patterns at 2x2 pixel scale), pixel techniques (hand-placed pixels at 100% precision, anti-aliasing limited to 1px), shading (1-2 pixel step gradients, controlled color ramps with 4-8 shades per color), and characteristic elements (clean pixel edges, deliberate jaggies at 45 degrees, limited color blending with 2x2 pixel patterns)"
    },
    "dark_fantasy": {
        "name": "Dark Fantasy",
        "description": "Gothic supernatural fantasy",
        "prompt": "rendered as a gothic supernatural artwork with specific elements including lighting (dramatic shadows at 80% density, selective rim lighting for ethereal effect), atmosphere (dark magical effects with 50% particle density, supernatural fog at 40% opacity), architectural details (gothic architecture with flying buttresses, ornate decorations with 90% detail preservation), color palette (rich darks with jewel tone accents, supernatural elements at 70% saturation), and mystical elements (dark magic effects with procedural generation, eldritch details with 85% clarity)"
    },
    "street_art": {
        "name": "Street Art",
        "description": "Urban art techniques",
        "prompt": "rendered as street art with specific urban art techniques including spray paint effects (aerosol texture at 85% authenticity, drip effects at 60% control), stencil work (sharp edge definition at 90% precision, layered stencil depth), urban texture (concrete and wall texture at 75% visibility, weathering effects at 50% intensity), color treatment (vibrant urban palette at 90% saturation, high contrast elements), and characteristic elements (urban decay integration, tag-style elements at 40% opacity)"
    },
    "vibrant": {
        "name": "Vibrant",
        "description": "Bold vibrant colors",
        "prompt": "render this as an artwork with intense color specifications including saturation (boosted to 90% with controlled preservation of detail), color relationships (complementary pairs at maximum contrast, harmonic balance with 60-30-10 rule), lighting (high key illumination with specular highlights at 95% brightness), color psychology (energetic warm tones dominant at 70%, cool accents at 30%), vibrancy effects (selective color enhancement, local contrast boost at 60% strength), and mood enhancement (dynamic color interaction, emotional color temperature emphasis)"
    },
    "pop_art": {
        "name": "Pop Art",
        "description": "Commercial art elements",
        "prompt": "rendered as a pop art artwork with precise commercial art elements including color treatment (bold flat colors at 100% saturation, halftone pattern effects at 60% density), graphic elements (bold outlines at 3px thickness, comic book style shading), repetition (multiple image iteration with 20% variation, grid arrangements), printing effects (registration marks at 1mm offset, Ben-Day dots at 40% scale), and characteristic elements (mass media imagery, commercial design elements)"
    },
    "heavenly": {
        "name": "Heavenly",
        "description": "Celestial ethereal artwork",
        "prompt": "render this as a celestial artwork with divine specifications including lighting (ethereal glow at 80% opacity, god rays with 60% intensity), atmosphere (heavenly clouds with 40% volumetric density, divine particle effects at 30% scatter rate), color palette (celestial colors with golden ratios, divine light at 90% luminosity), ethereal effects (angelic aura with procedural generation, divine symbols with 85% clarity), and atmospheric elements (heavenly mist at 25% opacity, floating divine elements with physics simulation)"
    },
    "anime": {
        "name": "Anime",
        "description": "Japanese animation style",
        "prompt": "rendered in anime style. Apply these style elements to the scene: {clean linework at 95% confidence, cel-shading at 85% opacity with hard light-shadow transitions, vibrant colors at 90% saturation}. Include anime-specific effects (speed lines at 45-degree angles with 70% opacity, impact frames with radial blur at 25% strength, dramatic lighting with stark shadows), depth treatment (detailed foreground at 100%, simplified backgrounds at 20% detail), and characteristic anime elements (gleaming highlights, dynamic action poses, expressive features). DO NOT change the subject matter, only apply anime styling techniques"
    },
    "studio_ghibli": {
        "name": "Studio Ghibli",
        "description": "Ghibli animation style",
        "prompt": "rendered in Studio Ghibli animation style. Apply these precise style elements: {gentle character features with round, expressive eyes (2-3 highlight points at 100% opacity), warm color palette at 80% saturation with colored shadows at 40% opacity, clean linework at 95% confidence}. Maintain scene composition while adding Ghibli's signature elements: soft diffused lighting at 30% strength, hand-painted textures at 85% detail, subtle environmental animation (particle effects at 20% density). Keep the original scene content but enhance it with Ghibli's characteristic warmth and charm."
    },
    "comic_book": {
        "name": "Comic Book",
        "description": "Comic book illustration style",
        "prompt": "rendered as a comic book illustration with precise stylistic elements. Detail the line art (bold outlines at 3-4px thickness, dynamic speed lines for motion, dramatic perspective with exaggerated foreshortening), coloring technique (flat colors with cel-shading, 4-color limited palette reminiscent of vintage comics, high contrast shadows at 80% opacity), panel composition (dramatic angles, extreme close-ups mixed with wide shots, Dutch angles for tension), and comic-specific elements (halftone dot patterns at 15-30% density, action effects like impact lines and motion blur, bold onomatopoeia text effects). Include signature comic art features (heroic poses with exaggerated proportions, dramatic facial expressions with heavy shadows, muscle definition with cross-hatching at 45-degree angles), background treatment (detailed in action scenes, simplified in character moments, speed lines at 60-degree angles), and classic comic book printing aesthetics (slight color misalignment, Ben-Day dots at 20% opacity, paper texture overlay at 10% strength)"
    },
    "sumi_e": {
        "name": "Sumi-e",
        "description": "Japanese ink wash painting",
        "prompt": "rendered in sumi-e (Japanese ink wash) style. Apply these essential techniques: {brush strokes (varying pressure 0-100%, four basic strokes: horizontal, vertical, diagonal, and dot), ink values (5 densities from 100% pure black to 20% pale wash), paper texture (visible grain at 30% strength)}. Maintain the original subject but interpret using these sumi-e elements: minimal detail with maximum expression, bold definitive strokes at 90% confidence, subtle gradations in wash areas. Include traditional effects: dry brush texture at key points, intentional bleeding at 40% control, and empty space 'ma' occupying 50% of composition. DO NOT default to traditional subjects, apply these techniques to the prompt's subject matter"
    },
    "oil_painting": {
        "name": "Oil Painting",
        "description": "Classical oil painting",
        "prompt": "rendered as a classical oil painting with precise traditional techniques including brush work (impasto technique for highlights at 2mm thickness, glazing layers at 20% opacity, scumbling for texture), color mixing (color temperature control with warm undertones, precise value relationships following Munsell system), texture development (canvas weave showing through at 30% visibility, brush stroke directionality following form), layering technique (underpainting in raw umber at 40% opacity, middle tones built up in 3-5 layers, final highlights with lead white simulation), and traditional effects (subtle sfumato at edges, chiaroscuro lighting with 80:20 shadow ratio, varnish effect with 85% gloss)"
    },
    "watercolor": {
        "name": "Watercolor",
        "description": "Watercolor painting style",
        "prompt": "rendered as a watercolor artwork with specific aqueous techniques including wash application (graduated wash with 40% pigment concentration, wet-in-wet technique with 70% paper saturation), edge control (hard edges at 100% definition, soft edges with 40% feathering, lost edges at key transitions), paper texture (cold press texture showing 30%, granulation effects in shadows), color blending (intentional blooms at focal points, controlled pigment diffusion at 50% rate), and traditional effects (reserved whites at 100% paper brightness, salt texture techniques at 25% coverage, lifting technique for highlights)"
    },
    "abstract_expressionist": {
        "name": "Abstract Expressionist",
        "description": "Abstract expressionist style",
        "prompt": "rendered in abstract expressionist style. Apply these precise techniques: {gestural brushwork (dynamic strokes at 80-100% intensity, visible texture at 90% strength, energetic movement patterns), color application (intuitive color relationships, impasto technique with 5-15mm thickness, spontaneous drips and splatters at 40% frequency), emotional expression (raw emotional energy at 90% intensity, subconscious mark-making, automatic drawing elements)}. Include characteristic elements: bold color fields with 85% saturation, layered paint effects with 30-70% opacity overlaps, controlled chaos with golden ratio proportions. DO NOT create a literal interpretation, transform the subject into pure expression"
    },
    "ukiyo_e": {
        "name": "Ukiyo-e",
        "description": "Japanese woodblock print",
        "prompt": "rendered in ukiyo-e woodblock print style. Apply these precise techniques: {linework (bold outlines at 2mm thickness, calligraphic strokes at 95% confidence, varying line weights for depth), color blocks (flat color areas with 90% consistency, subtle gradients using bokashi technique at 30% transition, traditional pigment simulation), compositional elements (asymmetrical balance following Japanese aesthetics, dramatic perspective with 70% depth compression, negative space 'ma' at 40% composition)}. Include characteristic elements: textile patterns at 95% historical accuracy, traditional nature elements with stylized simplification, woodgrain texture at 10% visibility. Add print effects: slight registration offset at 1mm, visible key block lines, traditional color palette with natural pigment simulation"
    },
    "cyberpunk": {
        "name": "Cyberpunk",
        "description": "Futuristic cyberpunk aesthetic",
        "prompt": "rendered in cyberpunk style. Apply these precise elements: {lighting (neon glow effects at 80% intensity, volumetric fog with 40% density, dynamic light sourcing from multiple points), color scheme (high contrast neon colors at 90% saturation, deep shadows at 95% darkness, rgb color splitting at 15% strength), technological details (holographic interfaces at 30% opacity, data visualization elements at 85% complexity, circuitry patterns with 70% detail)}. Add atmospheric elements: light pollution at 60% density, rain reflections on surfaces at 85% wetness, cybernetic augmentations with 90% technical detail. Include environmental features: vertical urban sprawl, industrial decay at 50% weathering, neon advertisement clutter at 75% density"
    },
    "steampunk": {
        "name": "Steampunk",
        "description": "Victorian-industrial style",
        "prompt": "rendered in steampunk style. Apply these precise elements: {mechanical details (brass and copper mechanisms at 90% detail, intricate gears with proper mechanical relationships, steam-powered devices with functional design), material properties (metallic surfaces with patina effects at 70% coverage, aged leather textures at 85% detail, polished wood grain at 90% visibility), Victorian elements (ornate decorative patterns with 95% period accuracy, architectural details with proper proportions, period-appropriate clothing details)}. Add characteristic features: steam effects at 40% opacity with directional flow, brass reflections at 70% specularity, mechanical complexity at 85% density. Include period atmosphere: gaslight illumination at 3000K color temperature, industrial haze at 20% density, aged material effects at 60% strength"
    },
    "art_nouveau": {
        "name": "Art Nouveau",
        "description": "Art Nouveau decorative style",
        "prompt": "rendered in Art Nouveau style. Apply these precise elements: {organic lines (flowing curves with mathematical precision, whiplash curves with 85% fluidity, natural forms with 90% stylization), decorative patterns (floral motifs with intricate detail at 95% complexity, symmetrical compositions with 80% balance, symbolic elements with period accuracy), color palette (muted naturalistic tones, metallic accents at 20% coverage, complementary color harmony)}. Include characteristic features: intertwining organic forms at 90% complexity, feminine figures with flowing hair at 85% detail, botanical accuracy at 90% stylization. Add period elements: stained glass effects with leading simulation, carved wood textures at 75% depth, metalwork details with 90% period accuracy"
    },
    "art_deco": {
        "name": "Art Deco",
        "description": "Art Deco geometric style",
        "prompt": "rendered in Art Deco style. Apply these precise elements: {geometric patterns (angular designs at 90% precision, symmetrical compositions with 95% accuracy, zigzag and sunburst motifs at 85% boldness), color scheme (bold contrasts with metallic accents, stepped color gradients at 30% intervals, jewel tones at 80% saturation), architectural details (stepped forms with mathematical proportion, streamlined shapes at 90% simplification, decorative relief at 70% depth)}. Include characteristic features: Machine Age aesthetic with chrome effects, streamlined forms with aerodynamic styling, decorative elements at 85% geometric precision. Add period materials: chrome and brass finishes at 75% reflectivity, luxurious surface treatments at 90% quality, lacquer effects with 85% gloss"
    },
    "hyperrealist": {
        "name": "Hyperrealist",
        "description": "Extreme precision hyperrealistic art",
        "prompt": "rendered as a hyperrealistic artwork with extreme precision including microscopic detail rendering (pore-level skin texture, individual hair strands at 100% accuracy, surface imperfections at microscopic level), lighting accuracy (physically accurate light behavior, subsurface scattering simulation at 95% accuracy, specular highlights with real-world properties), material properties (photorealistic texture mapping at 4K resolution, accurate reflectance models, physically based rendering), color accuracy (true-to-life color reproduction, advanced color grading with 100% accuracy, perfect white balance), and environmental interaction (accurate ambient occlusion, perfect shadow mapping, realistic atmospheric effects)"
    },
    "cubist": {
        "name": "Cubist",
        "description": "Geometric deconstruction style",
        "prompt": "rendered as a cubist artwork with specific geometric deconstruction including multiple viewpoints (simultaneous perspective views at 60-120 degree angles, fragmented planes with 85% geometric precision), spatial relationships (interlocking forms with mathematical accuracy, planar intersections at 75% complexity), color treatment (limited palette with 90% tonal variation, geometric color blocking), form analysis (deconstructed volumes with 80% analytical precision, geometric simplification of organic forms), and characteristic elements (faceted surfaces with sharp edges, geometric pattern overlay at 40% opacity)"
    },
    "bauhaus": {
        "name": "Bauhaus",
        "description": "Bauhaus design principles",
        "prompt": "rendered as a Bauhaus style artwork with specific design principles including geometric fundamentals (primary shapes at 100% geometric accuracy, modular grid system at 90% precision), color theory (primary colors with 95% purity, color blocking with 80% edge definition), typography integration (sans-serif letterforms at 90% geometric precision, functional text layout), material honesty (texture emphasis at 70% visibility, structural clarity), and characteristic elements (asymmetric balance with mathematical proportions, industrial aesthetic with 85% functionality focus)"
    },
    "romanticist": {
        "name": "Romanticist",
        "description": "Emotional and natural elements",
        "prompt": "rendered as a romanticist artwork with emotional and natural elements including atmospheric effects (dramatic skies with 80% emotional intensity, natural phenomena at peak drama), lighting (chiaroscuro effects at 90% contrast, golden hour illumination), emotional emphasis (passionate color saturation at 85%, dynamic composition with 75% movement), natural grandeur (sublime landscape elements, dramatic scale relationships), and characteristic elements (emotional brushwork at 70% visibility, heightened natural drama)"
    },
    "dada": {
        "name": "Dada",
        "description": "Anti-art elements",
        "prompt": "rendered as a Dada artwork with specific anti-art elements including absurdist composition (random element placement with 90% chaos factor, illogical juxtapositions), conventional disruption (traditional art rule breaking at 85% intensity, deliberate technical subversion), collage techniques (mixed media simulation at 75% complexity, found object integration), typography experimentation (text distortion at 80% randomness, unconventional layouts), and characteristic elements (anti-establishment imagery, cultural commentary through absurdity)"
    },
    "pencil_sketch": {
        "name": "Pencil Sketch",
        "description": "Traditional drawing techniques",
        "prompt": "rendered as a detailed pencil sketch with specific traditional drawing techniques including line work (varying pressure from 10-100%, hatching patterns at 45-degree angles, cross-hatching for shadows at 75% density), texture development (paper grain visibility at 20%, graphite blending at 40% smoothness), shading technique (value gradation from 2H to 8B, controlled smudging at 30% intensity), detail rendering (fine lines at 0.1mm precision, eraser highlight technique), and characteristic elements (sketchy gestural lines at 25% opacity, precise contour definition)"
    },
    "charcoal_drawing": {
        "name": "Charcoal Drawing",
        "description": "Dramatic charcoal medium",
        "prompt": "rendered as a dramatic charcoal drawing with specific medium characteristics including value range (deep blacks at 100% density, bright highlights through erasure, mid-tones at 50% pressure), texture effects (charcoal grain at 70% visibility, smudging techniques at 60% control), atmospheric elements (soft edges at 40% definition, dramatic contrast areas), mark-making (gestural strokes at 85% confidence, varied pressure application), and characteristic elements (carbon black richness, eraser highlight techniques at 90% precision)"
    },
    "pastel_art": {
        "name": "Pastel Art",
        "description": "Vibrant pastel medium",
        "prompt": "rendered as a vibrant pastel artwork with specific medium techniques including color layering (soft color blending at 70% opacity, pigment buildup techniques), texture development (paper tooth interaction at 80% visibility, burnishing effects at 60% smoothness), color vibrancy (saturated pigments at 90% intensity, complementary color layering), mark-making (varied stroke pressure from 20-100%, blending techniques at 50% softness), and characteristic elements (chalk-like texture, color scumbling at 40% intensity)"
    },
    "stained_glass": {
        "name": "Stained Glass",
        "description": "Stained glass design",
        "prompt": "rendered as a stained glass artwork with specific technical and design elements including lead lines (black outline simulation at 3mm thickness, geometric pattern construction at 95% precision), glass effects (transparent color at 80% opacity, light transmission simulation), color relationships (jewel tone palette at 90% saturation, complementary color placement), design elements (geometric division at 85% accuracy, structural support integration), and characteristic elements (glass texture at 70% visibility, leading pattern flow at 90% authenticity)"
    },
    "mosaic": {
        "name": "Mosaic",
        "description": "Tessellation techniques",
        "prompt": "rendered as a detailed mosaic artwork with specific tessellation techniques including tile work (individual tesserae at 5mm scale, grout lines at 2mm width), pattern development (geometric arrangement at 90% precision, flow lines at 85% continuity), color placement (deliberate color grouping at 80% coherence, gradient effects through tile size variation), texture elements (surface variation at 70% visibility, light reflection simulation), and characteristic elements (ancient technique simulation, mathematical tile placement)"
    },
    "isometric": {
        "name": "Isometric",
        "description": "Precise isometric projection",
        "prompt": "rendered as a precise isometric artwork with specific technical parameters including projection (30-degree angle consistency at 100% accuracy, parallel edge alignment), detail rendering (geometric precision at 95% accuracy, edge definition at 90% sharpness), depth representation (layered elements with mathematical spacing, consistent scale across planes), color treatment (flat color application at 85% consistency, subtle shading at 30% depth), and characteristic elements (technical accuracy, architectural precision)"
    },
    "low_poly": {
        "name": "Low Poly",
        "description": "Geometric optimization",
        "prompt": "rendered as a low poly artwork with specific geometric optimization techniques including polygon reduction (minimal vertex count with maximum visual impact, strategic edge placement at 85% efficiency), color treatment (flat shading per face, subtle gradient transitions at face boundaries), geometric simplification (form reduction to essential shapes, edge flow at 90% smoothness), lighting simulation (faceted shading at 75% accuracy, vertex color interpolation), and characteristic elements (crystalline appearance, geometric abstraction at 80% reduction)"
    },
    "retro": {
        "name": "Retro",
        "description": "Period-specific style",
        "prompt": "rendered as a retro style artwork with precise period-specific elements including vintage color palette (period-accurate colors at 90% authenticity, aged color simulation at 70% intensity), design elements (era-specific typography at 95% accuracy, authentic pattern work), aging effects (subtle wear at 40% intensity, color fading simulation), texture treatment (period-appropriate grain at 50% visibility, printing technique simulation), and characteristic elements (nostalgic imagery, authentic vintage details)"
    },
    "vintage": {
        "name": "Vintage",
        "description": "Aged period effects",
        "prompt": "rendered as a vintage artwork with precise aging and period effects including color treatment (faded color simulation at 60% intensity, sepia toning at 40% strength), aging simulation (paper yellowing at 50% intensity, edge wear at 30% degradation), texture elements (grain structure at 70% visibility, patina development), photographic effects (vignette at 25% strength, authentic film grain), and characteristic elements (period-accurate details, historical process simulation)"
    },
    "baroque": {
        "name": "Baroque",
        "description": "Elaborate dramatic elements",
        "prompt": "rendered as a baroque artwork with elaborate dramatic elements including lighting (dramatic chiaroscuro at 90% contrast, divine light rays at 70% intensity), composition (dynamic diagonal movement, theatrical arrangement at 85% drama), detail richness (ornate decoration at 95% complexity, luxurious material rendering), emotional expression (intense dramatic moments, passionate gestures at 80% intensity), and characteristic elements (religious and mythological motifs, architectural grandeur)"
    },
    "renaissance": {
        "name": "Renaissance",
        "description": "Classical elements",
        "prompt": "rendered as a renaissance style artwork with precise classical elements including perspective (mathematical linear perspective at 100% accuracy, atmospheric perspective at 70% depth), anatomical accuracy (golden ratio proportions, classical figure study precision), composition (triangular composition structure, balanced harmony at 85% symmetry), technique (sfumato effects at 50% softness, glazing technique simulation), and characteristic elements (classical architecture, period-accurate clothing and objects)"
    },
}; 