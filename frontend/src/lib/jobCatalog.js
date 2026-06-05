// Australian trades job catalog with measurement tools per job type.
// Each measurement field has a key, label, type, optional unit, options (for selects),
// default, min/max. Used by the EstimatorWizard to render the right tool per job.

export const JOB_GROUPS = [
  {
    trade: "Landscaping",
    icon: "Leaf",
    jobs: [
      {
        id: "general_landscaping",
        label: "General Landscaping (yard makeover)",
        description: "Front or back yard scope — typical residential makeover.",
        fields: [
          {
            key: "yard_location",
            label: "Yard",
            type: "select",
            options: ["Front yard", "Back yard", "Both yards"],
          },
          { key: "length_m", label: "Length", unit: "m", type: "number", min: 1 },
          { key: "width_m", label: "Width", unit: "m", type: "number", min: 1 },
          { key: "area_sqm", label: "Total area", unit: "m²", type: "number", min: 1, computed: "length_m*width_m" },
          {
            key: "access",
            label: "Site access",
            type: "select",
            options: ["Open — truck access", "Side path > 1.2m", "Tight — wheelbarrow only"],
          },
        ],
      },
      {
        id: "retaining_wall",
        label: "Retaining Wall",
        description: "Block, concrete sleeper or treated pine wall.",
        fields: [
          { key: "length_lm", label: "Wall length", unit: "lm", type: "number", min: 1 },
          { key: "height_m", label: "Wall height", unit: "m", type: "number", min: 0.3, step: 0.1, default: 0.9 },
          {
            key: "block_type",
            label: "Wall material",
            type: "select",
            options: [
              "Besser block (rendered)",
              "Concrete sleeper + steel post",
              "Treated pine sleeper",
              "Hardwood sleeper",
              "Natural stone",
              "Boulders",
            ],
          },
          { key: "ag_drainage", label: "Includes ag drainage?", type: "boolean", default: true },
          { key: "geofabric", label: "Geofabric (drainage / soil separation)?", type: "boolean", default: true },
        ],
      },
      {
        id: "turf_irrigation",
        label: "Turf & Irrigation",
        description: "New turf laid over prepped base, optional pop-up irrigation.",
        fields: [
          { key: "turf_area_sqm", label: "Turf area", unit: "m²", type: "number", min: 5 },
          {
            key: "turf_type",
            label: "Turf type",
            type: "select",
            options: ["Sir Walter Buffalo", "TifTuf Couch", "Kikuyu", "Zoysia (Empire/Sir Grange)"],
            default: "Sir Walter Buffalo",
          },
          { key: "irrigation_zones", label: "Irrigation zones", unit: "zones", type: "number", min: 0, default: 2 },
          { key: "soil_prep_mm", label: "Imported topsoil depth", unit: "mm", type: "number", default: 50 },
        ],
      },
      {
        id: "garden_design",
        label: "Garden Design & Planting",
        description: "Garden beds, edging, mulch, planting schedule.",
        fields: [
          { key: "bed_area_sqm", label: "Garden bed area", unit: "m²", type: "number", min: 1 },
          { key: "mulch_depth_mm", label: "Mulch depth", unit: "mm", type: "number", default: 75 },
          { key: "plant_qty", label: "Plant qty (estimate)", unit: "ea", type: "number", default: 20 },
          {
            key: "edging",
            label: "Bed edging",
            type: "select",
            options: ["None", "Steel edging", "Sleeper edging", "Concrete mowing strip"],
          },
        ],
      },
      {
        id: "paving_paths",
        label: "Paving & Paths",
        description: "Pavers on compacted roadbase with sand bedding.",
        fields: [
          { key: "paving_area_sqm", label: "Paved area", unit: "m²", type: "number", min: 1 },
          {
            key: "paver_type",
            label: "Paver type",
            type: "select",
            options: [
              "Concrete pavers (400x400)",
              "Clay pavers",
              "Bluestone / Sandstone",
              "Travertine",
              "Permeable pavers",
            ],
          },
          { key: "base_depth_mm", label: "Roadbase depth", unit: "mm", type: "number", default: 100 },
          { key: "pattern", label: "Lay pattern", type: "select", options: ["Stretcher", "Herringbone", "Stack bond", "Random"] },
        ],
      },
      {
        id: "pool_surround",
        label: "Pool Surrounds & Decking",
        description: "Paving or decking around an existing pool.",
        fields: [
          { key: "surround_area_sqm", label: "Surround area", unit: "m²", type: "number", min: 1 },
          {
            key: "material",
            label: "Material",
            type: "select",
            options: [
              "Travertine paving",
              "Concrete pavers (non-slip)",
              "Composite decking (Modwood/Ekodeck)",
              "Hardwood decking (Spotted Gum)",
              "Exposed aggregate concrete",
            ],
          },
          { key: "coping_lm", label: "Coping/edging length", unit: "lm", type: "number", default: 0 },
        ],
      },
      {
        id: "fencing_screening",
        label: "Fencing & Screening",
        description: "Boundary or screening fence install.",
        fields: [
          { key: "fence_length_lm", label: "Fence length", unit: "lm", type: "number", min: 1 },
          { key: "fence_height_m", label: "Fence height", unit: "m", type: "number", default: 1.8, step: 0.1 },
          {
            key: "fence_type",
            label: "Fence type",
            type: "select",
            options: [
              "Colorbond",
              "Timber paling (treated pine)",
              "Hardwood paling",
              "Aluminium slat",
              "Pool-compliant glass",
              "Bamboo screening",
            ],
          },
          { key: "gates", label: "Gates (qty)", unit: "ea", type: "number", default: 1 },
        ],
      },
    ],
  },
  {
    trade: "Decorative Rocks & Pebbles",
    icon: "Gem",
    jobs: [
      {
        id: "riverstone_pebbles",
        label: "Riverstone & Organic River Pebbles (20mm–40mm)",
        description: "Natural river pebble groundcover laid over weed membrane.",
        fields: [
          { key: "length_m", label: "Length", unit: "m", type: "number", min: 0, step: 0.1, placeholder: "0.0" },
          { key: "width_m", label: "Width", unit: "m", type: "number", min: 0, step: 0.1, placeholder: "0.0" },
          { key: "depth_mm", label: "Target depth", unit: "mm", type: "number", min: 0, placeholder: "100" },
        ],
      },
      {
        id: "white_quartz",
        label: "Premium White Quartz / Snow White",
        description: "Bright white quartz feature stone for beds and borders.",
        fields: [
          { key: "length_m", label: "Length", unit: "m", type: "number", min: 0, step: 0.1, placeholder: "0.0" },
          { key: "width_m", label: "Width", unit: "m", type: "number", min: 0, step: 0.1, placeholder: "0.0" },
          { key: "depth_mm", label: "Target depth", unit: "mm", type: "number", min: 0, placeholder: "100" },
        ],
      },
      {
        id: "charcoal_basalt",
        label: "Charcoal Volcanic Lava & Tumbled Basalt",
        description: "Dark charcoal basalt for modern, high-contrast groundcover.",
        fields: [
          { key: "length_m", label: "Length", unit: "m", type: "number", min: 0, step: 0.1, placeholder: "0.0" },
          { key: "width_m", label: "Width", unit: "m", type: "number", min: 0, step: 0.1, placeholder: "0.0" },
          { key: "depth_mm", label: "Target depth", unit: "mm", type: "number", min: 0, placeholder: "100" },
        ],
      },
      {
        id: "sunset_gold_sandstone",
        label: "Sunset Gold / Tumbled Sandstone",
        description: "Warm gold tumbled sandstone for paths and feature beds.",
        fields: [
          { key: "length_m", label: "Length", unit: "m", type: "number", min: 0, step: 0.1, placeholder: "0.0" },
          { key: "width_m", label: "Width", unit: "m", type: "number", min: 0, step: 0.1, placeholder: "0.0" },
          { key: "depth_mm", label: "Target depth", unit: "mm", type: "number", min: 0, placeholder: "100" },
        ],
      },
      {
        id: "scoria_volcanic_mulch",
        label: "Scoria / Volcanic Mulch Replacement",
        description: "Lightweight red/black scoria as a long-life mulch alternative.",
        fields: [
          { key: "length_m", label: "Length", unit: "m", type: "number", min: 0, step: 0.1, placeholder: "0.0" },
          { key: "width_m", label: "Width", unit: "m", type: "number", min: 0, step: 0.1, placeholder: "0.0" },
          { key: "depth_mm", label: "Target depth", unit: "mm", type: "number", min: 0, placeholder: "75" },
        ],
      },
    ],
  },
  {
    trade: "Concreting",
    icon: "Box",
    jobs: [
      {
        id: "slab",
        label: "Slab (shed / house pad / patio)",
        description: "Reinforced concrete slab on prepared base.",
        fields: [
          { key: "length_m", label: "Length", unit: "m", type: "number", min: 1 },
          { key: "width_m", label: "Width", unit: "m", type: "number", min: 1 },
          { key: "area_sqm", label: "Area", unit: "m²", type: "number", computed: "length_m*width_m", min: 1 },
          { key: "thickness_mm", label: "Thickness", unit: "mm", type: "number", default: 100 },
          {
            key: "concrete_grade",
            label: "Concrete grade",
            type: "select",
            options: ["20MPa", "25MPa", "32MPa", "40MPa"],
            default: "32MPa",
          },
          {
            key: "reinforcement",
            label: "Reinforcement",
            type: "select",
            options: ["SL62 mesh", "SL72 mesh", "SL82 mesh", "SL92 mesh", "F72 fabric", "N12 bar mat", "None"],
            default: "SL82 mesh",
          },
          {
            key: "finish",
            label: "Finish",
            type: "select",
            options: ["Broom", "Steel trowel", "Exposed aggregate", "Stencilled", "Polished", "Coloured oxide"],
            default: "Broom",
          },
          { key: "waterproof_underlay", label: "Waterproof underlay", type: "boolean", default: true },
        ],
      },
      {
        id: "driveway",
        label: "Driveway",
        description: "Concrete driveway from kerb to garage.",
        fields: [
          { key: "length_m", label: "Length (kerb to garage)", unit: "m", type: "number", min: 1 },
          { key: "width_m", label: "Width", unit: "m", type: "number", min: 1, default: 3.5 },
          { key: "area_sqm", label: "Area", unit: "m²", type: "number", computed: "length_m*width_m", min: 1 },
          { key: "thickness_mm", label: "Thickness", unit: "mm", type: "number", default: 125 },
          {
            key: "finish",
            label: "Finish",
            type: "select",
            options: ["Plain broom", "Exposed aggregate", "Stencilled", "Coloured", "Stamped/imprinted"],
            default: "Exposed aggregate",
          },
          { key: "crossover", label: "Includes council crossover?", type: "boolean", default: false },
        ],
      },
      {
        id: "footings",
        label: "Footings & Strip Footings",
        description: "Trenched footings for slabs, walls or fences.",
        fields: [
          { key: "footing_length_lm", label: "Total length", unit: "lm", type: "number", min: 1 },
          { key: "footing_width_mm", label: "Footing width", unit: "mm", type: "number", default: 300 },
          { key: "footing_depth_mm", label: "Footing depth", unit: "mm", type: "number", default: 400 },
          {
            key: "reo",
            label: "Reinforcement",
            type: "select",
            options: ["2 x N12 bar", "3 x N12 bar", "4 x N12 bar w/ ligs", "Engineer-specified"],
            default: "3 x N12 bar",
          },
        ],
      },
      {
        id: "footpath_kerb",
        label: "Footpath / Path / Kerb",
        description: "Concrete footpath or kerb runs.",
        fields: [
          { key: "length_lm", label: "Length", unit: "lm", type: "number", min: 1 },
          { key: "width_m", label: "Width", unit: "m", type: "number", default: 1.2 },
          { key: "area_sqm", label: "Area", unit: "m²", type: "number", computed: "length_lm*width_m", min: 1 },
          { key: "thickness_mm", label: "Thickness", unit: "mm", type: "number", default: 100 },
          {
            key: "finish",
            label: "Finish",
            type: "select",
            options: ["Broom", "Exposed aggregate", "Coloured"],
            default: "Broom",
          },
        ],
      },
    ],
  },
  {
    trade: "Earthmoving",
    icon: "Truck",
    jobs: [
      {
        id: "bulk_earthworks",
        label: "Bulk Earthworks (Cut & Fill)",
        description: "Site cut/fill to level a pad or yard.",
        fields: [
          { key: "site_area_sqm", label: "Site area", unit: "m²", type: "number", min: 5 },
          { key: "avg_cut_mm", label: "Avg cut depth", unit: "mm", type: "number", default: 200 },
          { key: "cut_volume_m3", label: "Cut volume", unit: "m³", type: "number", computed: "site_area_sqm*avg_cut_mm/1000", min: 1 },
          {
            key: "soil_class",
            label: "Soil class (AS 2870)",
            type: "select",
            options: [
              "A — Sand / Rock",
              "S — Slightly reactive clay",
              "M — Moderately reactive",
              "H1 — Highly reactive",
              "H2 — Highly reactive (severe)",
              "E — Extremely reactive",
              "P — Problem site",
            ],
            default: "M — Moderately reactive",
          },
          {
            key: "spoil_disposal",
            label: "Spoil disposal",
            type: "select",
            options: ["Off-site to tip", "Stockpile on-site", "Reuse as fill"],
          },
          { key: "geofabric", label: "Geofabric (erosion / sediment control)?", type: "boolean", default: false },
        ],
      },
      {
        id: "excavation_trenching",
        label: "Excavation / Trenching",
        description: "Trenches for services, footings or drainage.",
        fields: [
          { key: "length_lm", label: "Trench length", unit: "lm", type: "number", min: 1 },
          { key: "width_mm", label: "Trench width", unit: "mm", type: "number", default: 600 },
          { key: "depth_mm", label: "Trench depth", unit: "mm", type: "number", default: 900 },
          {
            key: "service_type",
            label: "Service type",
            type: "select",
            options: ["Stormwater", "Sewer", "Water mains", "Electrical / NBN conduit", "Footing trench"],
          },
          { key: "rock_expected", label: "Rock expected?", type: "boolean", default: false },
        ],
      },
      {
        id: "pad_preparation",
        label: "Pad Preparation",
        description: "Compacted roadbase pad for slab or shed.",
        fields: [
          { key: "pad_area_sqm", label: "Pad area", unit: "m²", type: "number", min: 1 },
          { key: "roadbase_depth_mm", label: "Roadbase depth", unit: "mm", type: "number", default: 150 },
          { key: "waterproof_underlay", label: "Waterproof underlay under pad?", type: "boolean", default: true },
        ],
      },
      {
        id: "site_clearing",
        label: "Site Clearing & Stripping",
        description: "Vegetation strip, topsoil removal.",
        fields: [
          { key: "clear_area_sqm", label: "Area to clear", unit: "m²", type: "number", min: 1 },
          {
            key: "vegetation",
            label: "Vegetation",
            type: "select",
            options: [
              "Light grass / weeds",
              "Heavy weeds / shrubs",
              "Small trees (<3m)",
              "Mature trees (arborist req.)",
            ],
          },
          { key: "topsoil_strip_mm", label: "Topsoil strip depth", unit: "mm", type: "number", default: 100 },
        ],
      },
      {
        id: "spoil_removal",
        label: "Spoil / Truck Removal",
        description: "Cart-away of excavated material.",
        fields: [
          { key: "spoil_volume_m3", label: "Spoil volume", unit: "m³", type: "number", min: 1 },
          {
            key: "tipper_size",
            label: "Truck size",
            type: "select",
            options: ["6-wheeler (~6m³)", "8-wheeler (~10m³)", "Truck + dog (~18m³)", "Semi (~24m³)"],
            default: "8-wheeler (~10m³)",
          },
          { key: "round_trip_km", label: "One-way distance to tip", unit: "km", type: "number", default: 15 },
        ],
      },
    ],
  },
];

// Flat lookup by job id
export const JOB_LOOKUP = JOB_GROUPS.flatMap((g) =>
  g.jobs.map((j) => ({ ...j, trade: g.trade }))
).reduce((acc, j) => {
  acc[j.id] = j;
  return acc;
}, {});

export function jobsByIds(ids) {
  return ids.map((id) => JOB_LOOKUP[id]).filter(Boolean);
}
