// Single Renderer
(function () {
  'use strict';

  // ===== CONSTANTS =====
  const GITHUB_COLORS = {
    "1C Enterprise": "#814CCC",
    "2-Dimensional Array": "#38761D",
    "4D": "#004289",
    "ABAP": "#E8274B",
    "ABAP CDS": "#555e25",
    "ActionScript": "#882B0F",
    "Ada": "#02f88c",
    "Adblock Filter List": "#800000",
    "Adobe Font Metrics": "#fa0f00",
    "Agda": "#315665",
    "AGS Script": "#B9D9FF",
    "AIDL": "#34EB6B",
    "Aiken": "#640ff8",
    "AL": "#3AA2B5",
    "Aleo": "#154BF9",
    "ALGOL": "#D1E0DB",
    "Alloy": "#64C800",
    "Alpine Abuild": "#0D597F",
    "Altium Designer": "#A89663",
    "AMPL": "#E6EFBB",
    "AngelScript": "#C7D7DC",
    "Answer Set Programming": "#A9CC29",
    "Ant Build System": "#A9157E",
    "Antlers": "#ff269e",
    "ANTLR": "#9DC3FF",
    "ApacheConf": "#d12127",
    "Apex": "#1797c0",
    "API Blueprint": "#2ACCA8",
    "APL": "#5A8164",
    "Apollo Guidance Computer": "#0B3D91",
    "AppleScript": "#101F1F",
    "Arc": "#aa2afe",
    "ArkTS": "#0080ff",
    "AsciiDoc": "#73a0c5",
    "ASP.NET": "#9400ff",
    "AspectJ": "#a957b0",
    "Assembly": "#6E4C13",
    "Astro": "#ff5a03",
    "Asymptote": "#ff0000",
    "ATS": "#1ac620",
    "Augeas": "#9CC134",
    "AutoHotkey": "#6594b9",
    "AutoIt": "#1C3552",
    "Avro IDL": "#0040FF",
    "Awk": "#c30e9b",
    "B": "#da7666",
    "B (Formal Method)": "#8aa8c5",
    "B4X": "#00e4ff",
    "Ballerina": "#FF5000",
    "BAML": "#a855f7",
    "BASIC": "#ff0000",
    "Batchfile": "#C1F12E",
    "BBCode": "#CAFF42",
    "Beef": "#a52f4e",
    "Berry": "#15A13C",
    "BibTeX": "#778899",
    "Bicep": "#519aba",
    "Bikeshed": "#5562ac",
    "BIRD2": "#b6d7e4",
    "Bison": "#6A463F",
    "BitBake": "#00bce4",
    "Blade": "#f7523f",
    "BlitzBasic": "#00FFAE",
    "BlitzMax": "#cd6400",
    "Blueprint": "#3584E4",
    "Bluespec": "#12223c",
    "Bluespec BH": "#12223c",
    "Boo": "#d4bec1",
    "Boogie": "#c80fa0",
    "BQN": "#2b7067",
    "Brainfuck": "#2F2530",
    "BrighterScript": "#66AABB",
    "Brightscript": "#662D91",
    "Browserslist": "#ffd539",
    "Bru": "#F4AA41",
    "BuildStream": "#006bff",
    "C": "#555555",
    "C#": "#7355dd",
    "C++": "#f34b7d",
    "C3": "#2563eb",
    "Cabal Config": "#483465",
    "Caddyfile": "#22b638",
    "Cadence": "#00ef8b",
    "Cairo": "#ff4a48",
    "Cairo Zero": "#ff4a48",
    "CameLIGO": "#3be133",
    "Cangjie": "#00868B",
    "CAP CDS": "#0092d1",
    "Cap'n Proto": "#c42727",
    "Carbon": "#222222",
    "Ceylon": "#dfa535",
    "Chapel": "#8dc63f",
    "ChucK": "#3f8000",
    "Circom": "#707575",
    "Cirru": "#ccccff",
    "Clarion": "#db901e",
    "Clarity": "#5546ff",
    "Classic ASP": "#6a40fd",
    "Clean": "#3F85AF",
    "Click": "#E4E6F3",
    "CLIPS": "#00A300",
    "Clojure": "#db5855",
    "Closure Templates": "#0d948f",
    "Cloud Firestore Security Rules": "#FFA000",
    "Clue": "#0009b5",
    "CMake": "#DA3434",
    "CodeQL": "#140f46",
    "CoffeeScript": "#244776",
    "ColdFusion": "#ed2cd6",
    "ColdFusion CFC": "#ed2cd6",
    "COLLADA": "#F1A42B",
    "Common Lisp": "#3fb68b",
    "Common Workflow Language": "#B5314C",
    "Component Pascal": "#B0CE4E",
    "Cooklang": "#E15A29",
    "CQL": "#006091",
    "crontab": "#ead7ac",
    "Crystal": "#000100",
    "CSON": "#244776",
    "Csound": "#1a1a1a",
    "Csound Document": "#1a1a1a",
    "Csound Score": "#1a1a1a",
    "CSS": "#663399",
    "CSV": "#237346",
    "Cuda": "#3A4E3A",
    "CUE": "#5886E1",
    "Curry": "#531242",
    "CWeb": "#00007a",
    "Cylc": "#00b3fd",
    "Cypher": "#34c0eb",
    "Cython": "#fedf5b",
    "D": "#ba595e",
    "D2": "#526ee8",
    "Dafny": "#FFEC25",
    "Darcs Patch": "#8eff23",
    "Dart": "#00B4AB",
    "Daslang": "#d3d3d3",
    "DataWeave": "#003a52",
    "Debian Package Control File": "#D70751",
    "DenizenScript": "#FBEE96",
    "Dhall": "#dfafff",
    "DirectX 3D File": "#aace60",
    "DM": "#447265",
    "Dockerfile": "#384d54",
    "Dogescript": "#cca760",
    "Dotenv": "#e5d559",
    "Dune": "#89421e",
    "Dylan": "#6c616e",
    "E": "#ccce35",
    "Earthly": "#2af0ff",
    "Easybuild": "#069406",
    "eC": "#913960",
    "Ecere Projects": "#913960",
    "ECL": "#8a1267",
    "ECLiPSe": "#001d9d",
    "Ecmarkup": "#eb8131",
    "Edge": "#0dffe0",
    "EdgeQL": "#31A7FF",
    "EditorConfig": "#fff1f2",
    "Eiffel": "#4d6977",
    "EJS": "#a91e50",
    "Elixir": "#8847B9",
    "Elm": "#60B5CC",
    "Elvish": "#55BB55",
    "Elvish Transcript": "#55BB55",
    "Emacs Lisp": "#c065db",
    "EmberScript": "#FFF4F3",
    "EQ": "#a78649",
    "Erlang": "#B83998",
    "Euphoria": "#FF790B",
    "F#": "#b845fc",
    "F*": "#572e30",
    "Factor": "#636746",
    "Fancy": "#7b9db4",
    "Fantom": "#14253c",
    "Faust": "#c37240",
    "Fennel": "#fff3d7",
    "FIGlet Font": "#FFDDBB",
    "Filebench WML": "#F6B900",
    "FIRRTL": "#2f632f",
    "fish": "#4aae47",
    "FlatBuffers": "#ed284a",
    "Flix": "#d44a45",
    "Fluent": "#ffcc33",
    "FLUX": "#88ccff",
    "Forth": "#341708",
    "Fortran": "#4d41b1",
    "Fortran Free Form": "#4d41b1",
    "FPP": "#d37327",
    "FreeBASIC": "#141AC9",
    "FreeMarker": "#0050b2",
    "Frege": "#00cafe",
    "Futhark": "#5f021f",
    "G-code": "#D08CF2",
    "Game Maker Language": "#71b417",
    "GAML": "#FFC766",
    "GAMS": "#f49a22",
    "GAP": "#0000cc",
    "GCC Machine Description": "#FFCFAB",
    "GDScript": "#355570",
    "GDShader": "#478CBF",
    "GEDCOM": "#003058",
    "Gemfile.lock": "#701516",
    "Gemini": "#ff6900",
    "Genero 4gl": "#63408e",
    "Genero per": "#d8df39",
    "Genie": "#fb855d",
    "Genshi": "#951531",
    "Gentoo Ebuild": "#9400ff",
    "Gentoo Eclass": "#9400ff",
    "Gerber Image": "#d20b00",
    "Gherkin": "#5B2063",
    "Git Attributes": "#F44D27",
    "Git Commit": "#F44D27",
    "Git Config": "#F44D27",
    "Git Revision List": "#F44D27",
    "Gleam": "#ffaff3",
    "Glimmer JS": "#F5835F",
    "Glimmer TS": "#3178c6",
    "GLSL": "#5686a5",
    "Glyph": "#c1ac7f",
    "Gno": "#226c57",
    "Gnuplot": "#f0a9f0",
    "Go": "#00ADD8",
    "Go Checksums": "#00ADD8",
    "Go Module": "#00ADD8",
    "Go Template": "#00ADD8",
    "Go Workspace": "#00ADD8",
    "Godot Resource": "#355570",
    "Golo": "#88562A",
    "Gosu": "#82937f",
    "Grace": "#615f8b",
    "Gradle": "#02303a",
    "Gradle Kotlin DSL": "#02303a",
    "Grammatical Framework": "#ff0000",
    "GraphQL": "#e10098",
    "Graphviz (DOT)": "#2596be",
    "Groovy": "#4298b8",
    "Groovy Server Pages": "#4298b8",
    "GSC": "#FF6800",
    "GtkRC": "#7fe719",
    "Hack": "#878787",
    "Haml": "#ece2a9",
    "Handlebars": "#f7931e",
    "HAProxy": "#106da9",
    "Harbour": "#0e60e3",
    "Hare": "#9d7424",
    "Haskell": "#5e5086",
    "Haxe": "#df7900",
    "HCL": "#844FBA",
    "HIP": "#4F3A4F",
    "HiveQL": "#dce200",
    "HLSL": "#aace60",
    "HOCON": "#9ff8ee",
    "HolyC": "#ffefaf",
    "hoon": "#00b171",
    "Hosts File": "#308888",
    "HTML": "#e34c26",
    "HTML+ECR": "#2e1052",
    "HTML+EEX": "#6e4a7e",
    "HTML+ERB": "#701516",
    "HTML+PHP": "#4f5d95",
    "HTML+Razor": "#512be4",
    "HTTP": "#005C9C",
    "Hurl": "#FF0288",
    "HXML": "#f68712",
    "Hy": "#7790B2",
    "iCalendar": "#ec564c",
    "IDL": "#a3522f",
    "Idris": "#b30000",
    "Ignore List": "#000000",
    "IGOR Pro": "#0000cc",
    "IL Assembly": "#512BD4",
    "ImageJ Macro": "#99AAFF",
    "Imba": "#16cec6",
    "ImHex Pattern Language": "#3a6be0",
    "INI": "#d1dbe0",
    "Inno Setup": "#264b99",
    "Io": "#a9188d",
    "Ioke": "#078193",
    "Isabelle": "#FEFE00",
    "Isabelle ROOT": "#FEFE00",
    "ISPC": "#2D68B1",
    "J": "#9EEDFF",
    "Jac": "#FC792D",
    "Jai": "#ab8b4b",
    "Janet": "#0886a5",
    "JAR Manifest": "#b07219",
    "Jasmin": "#d03600",
    "JASS": "#FF0303",
    "Java": "#b07219",
    "Java Properties": "#2A6277",
    "Java Server Pages": "#2A6277",
    "Java Template Engine": "#2A6277",
    "JavaScript": "#f1e05a",
    "JavaScript+ERB": "#f1e05a",
    "JCL": "#d90e09",
    "Jest Snapshot": "#15c213",
    "JetBrains MPS": "#21D789",
    "JFlex": "#DBCA00",
    "Jinja": "#a52a22",
    "Jison": "#56b3cb",
    "Jison Lex": "#56b3cb",
    "Jolie": "#843179",
    "jq": "#c7254e",
    "JSON": "#292929",
    "JSON with Comments": "#292929",
    "JSON5": "#267CB9",
    "JSONiq": "#40d47e",
    "JSONLD": "#0c479c",
    "Jsonnet": "#0064bd",
    "Julia": "#a270ba",
    "Julia REPL": "#a270ba",
    "Jupyter Notebook": "#DA5B0B",
    "Just": "#384d54",
    "Kaitai Struct": "#773b37",
    "KakouneScript": "#6f8042",
    "KCL": "#7ABABF",
    "KDL": "#ffb3b3",
    "KerboScript": "#41adf0",
    "KFramework": "#4195c5",
    "KiCad Layout": "#2f4aab",
    "KiCad Legacy Layout": "#2f4aab",
    "KiCad Schematic": "#2f4aab",
    "Koka": "#215166",
    "KoLmafia ASH": "#B9D9B9",
    "Kotlin": "#A97BFF",
    "KRL": "#28430A",
    "kvlang": "#1da6e0",
    "LabVIEW": "#fede06",
    "Lambdapi": "#8027a3",
    "Langium": "#2c8c87",
    "Lark": "#2980B9",
    "Lasso": "#999999",
    "Latte": "#f2a542",
    "Leo": "#C4FFC2",
    "Less": "#1d365d",
    "Lex": "#DBCA00",
    "LFE": "#4C3023",
    "LigoLANG": "#0e74ff",
    "LilyPond": "#9ccc7c",
    "Liquid": "#67b8de",
    "Liquidsoap": "#990066",
    "Literate Agda": "#315665",
    "Literate CoffeeScript": "#244776",
    "Literate Haskell": "#5e5086",
    "LiveCode Script": "#0c5ba5",
    "LiveScript": "#499886",
    "LLVM": "#185619",
    "LLVM TableGen": "#6E8B3D",
    "Lobster": "#f95428",
    "Logtalk": "#295b9a",
    "LOLCODE": "#cc9900",
    "LookML": "#652B81",
    "LSL": "#3d9970",
    "Lua": "#000080",
    "Luau": "#00A2FF",
    "M3U": "#179C7D",
    "Macaulay2": "#d8ffff",
    "Makefile": "#427819",
    "Mako": "#7e858d",
    "Markdown": "#083fa1",
    "Marko": "#42bff2",
    "Mask": "#f97732",
    "Mathematical Programming System": "#0530ad",
    "MATLAB": "#e16737",
    "Max": "#c4a79c",
    "MAXScript": "#00a6a6",
    "mcfunction": "#E22837",
    "mdsvex": "#5f9ea0",
    "MDX": "#fcb32c",
    "Mercury": "#ff2b2b",
    "Mermaid": "#ff3670",
    "Meson": "#007800",
    "Metal": "#8f14e9",
    "MeTTa": "#6a5acd",
    "MiniScript": "#4B4A56",
    "MiniYAML": "#ff1111",
    "MiniZinc": "#06a9e6",
    "Mint": "#02b046",
    "Mirah": "#c7a938",
    "mIRC Script": "#3d57c3",
    "MLIR": "#5EC8DB",
    "Modelica": "#de1d31",
    "Modula-2": "#10253f",
    "Modula-3": "#223388",
    "Mojo": "#ff4c1f",
    "Monkey C": "#8D6747",
    "MoonBit": "#b92381",
    "MoonScript": "#ff4585",
    "Motoko": "#fbb03b",
    "Motorola 68K Assembly": "#005daa",
    "Move": "#4a137a",
    "MQL4": "#62A8D6",
    "MQL5": "#4A76B8",
    "MTML": "#b7e1f4",
    "mupad": "#244963",
    "Mustache": "#724b3b",
    "nanorc": "#2d004d",
    "Nasal": "#1d2c4e",
    "NCL": "#28431f",
    "Nearley": "#990000",
    "Nemerle": "#3d3c6e",
    "nesC": "#94B0C7",
    "NetLinx": "#0aa0ff",
    "NetLinx+ERB": "#747faa",
    "NetLogo": "#ff6375",
    "NewLisp": "#87AED7",
    "Nextflow": "#3ac486",
    "Nginx": "#009639",
    "Nickel": "#E0C3FC",
    "Nim": "#ffc200",
    "Nit": "#009917",
    "Nix": "#7e7eff",
    "NMODL": "#00356B",
    "Noir": "#2f1f49",
    "NPM Config": "#cb3837",
    "Nu": "#c9df40",
    "NumPy": "#9C8AF9",
    "Nunjucks": "#3d8137",
    "Nushell": "#4E9906",
    "NWScript": "#111522",
    "OASv2-json": "#85ea2d",
    "OASv2-yaml": "#85ea2d",
    "OASv3-json": "#85ea2d",
    "OASv3-yaml": "#85ea2d",
    "Objective-C": "#438eff",
    "Objective-C++": "#6866fb",
    "Objective-J": "#ff0c5a",
    "ObjectScript": "#424893",
    "OCaml": "#ef7a08",
    "Odin": "#60AFFE",
    "Omgrofl": "#cabbff",
    "OMNeT++ MSG": "#a0e0a0",
    "OMNeT++ NED": "#08607c",
    "ooc": "#b0b77e",
    "Opal": "#f7ede0",
    "Open Policy Agent": "#7d9199",
    "OpenAPI Specification v2": "#85ea2d",
    "OpenAPI Specification v3": "#85ea2d",
    "OpenCL": "#ed2e2d",
    "OpenEdge ABL": "#5ce600",
    "OpenQASM": "#AA70FF",
    "OpenSCAD": "#e5cd45",
    "Option List": "#476732",
    "Org": "#77aa99",
    "OverpassQL": "#cce2aa",
    "OverPy": "#78b355",
    "Oxygene": "#cdd0e3",
    "Oz": "#fab738",
    "P4": "#7055b5",
    "Pact": "#F7A8B8",
    "Pan": "#cc0000",
    "Papyrus": "#6600cc",
    "Parrot": "#f3ca0a",
    "Pascal": "#E3F171",
    "Pawn": "#dbb284",
    "PDDL": "#0d00ff",
    "PEG.js": "#234d6b",
    "Pep8": "#C76F5B",
    "Perl": "#0298c3",
    "PHP": "#4F5D95",
    "PicoLisp": "#6067af",
    "PigLatin": "#fcd7de",
    "Pike": "#005390",
    "Pip Requirements": "#FFD343",
    "pkg-config": "#2b5e82",
    "Pkl": "#6b9543",
    "PlantUML": "#fbbd16",
    "PLpgSQL": "#336790",
    "PLSQL": "#dad8d8",
    "PogoScript": "#d80074",
    "Polar": "#ae81ff",
    "Portugol": "#f8bd00",
    "PostCSS": "#dc3a0c",
    "PostScript": "#da291c",
    "POV-Ray SDL": "#6bac65",
    "Power Query": "#d38e0d",
    "PowerBuilder": "#8f0f8d",
    "PowerShell": "#012456",
    "Praat": "#c8506d",
    "Prisma": "#0c344b",
    "Pro*C": "#bb8368",
    "Processing": "#0096D8",
    "Procfile": "#3B2F63",
    "Prolog": "#74283c",
    "Promela": "#de0000",
    "Propeller Spin": "#7fa2a7",
    "Pug": "#a86454",
    "Puppet": "#302B6D",
    "PureBasic": "#5a6986",
    "PureScript": "#1D222D",
    "Pyret": "#ee1e10",
    "Python": "#3572A5",
    "Python console": "#3572A5",
    "Python traceback": "#3572A5",
    "q": "#0040cd",
    "Q#": "#fed659",
    "QML": "#44a51c",
    "Qt Script": "#00b841",
    "Quake": "#882233",
    "QuakeC": "#975777",
    "Quartus Simulation IP": "#58C42E",
    "QuickBASIC": "#008080",
    "Quint": "#9d6ce5",
    "R": "#198CE7",
    "Racket": "#3c5caa",
    "Ragel": "#9d5200",
    "Raku": "#0000fb",
    "RAML": "#77d9fb",
    "Rascal": "#fffaa0",
    "RAScript": "#2C97FA",
    "RBS": "#701516",
    "RDoc": "#701516",
    "Reason": "#ff5847",
    "ReasonLIGO": "#ff5847",
    "Rebol": "#358a5b",
    "Record Jar": "#0673ba",
    "Red": "#f50000",
    "Redscript": "#f44336",
    "Regular Expression": "#009a00",
    "Ren'Py": "#ff7f7f",
    "ReScript": "#ed5051",
    "reStructuredText": "#141414",
    "REXX": "#d90e09",
    "Rez": "#FFDAB3",
    "Rhai": "#FBA63B",
    "Ring": "#2D54CB",
    "Riot": "#A71E49",
    "RMarkdown": "#198ce7",
    "RobotFramework": "#00c0b5",
    "Roc": "#7c38f5",
    "Rocq Prover": "#d0b68c",
    "Roff": "#ecdebe",
    "Roff Manpage": "#ecdebe",
    "RON": "#a62c00",
    "ROS Interface": "#22314e",
    "Rouge": "#cc0088",
    "RouterOS Script": "#DE3941",
    "RPGLE": "#2BDE21",
    "Ruby": "#701516",
    "RUNOFF": "#665a4e",
    "Rust": "#dea584",
    "Sail": "#259dd5",
    "Salt": "#57bcad",
    "SAS": "#B34936",
    "Sass": "#a53b70",
    "Scala": "#c22d40",
    "Scaml": "#bd181a",
    "Scenic": "#fdc700",
    "Scheme": "#1e4aec",
    "Scilab": "#ca0f21",
    "SCSS": "#c6538c",
    "sed": "#64b970",
    "Self": "#0579aa",
    "ShaderLab": "#222c37",
    "Shell": "#89e051",
    "ShellCheck Config": "#cecfcb",
    "Shen": "#120F14",
    "Simple File Verification": "#C9BFED",
    "Singularity": "#64E6AD",
    "SIP": "#4E8D83",
    "Slang": "#1fbec9",
    "Slash": "#007eff",
    "Slice": "#003fa2",
    "Slim": "#2b2b2b",
    "Slint": "#2379F4",
    "Smalltalk": "#596706",
    "Smarty": "#f0c040",
    "Smithy": "#c44536",
    "SmPL": "#c94949",
    "Snakemake": "#419179",
    "Solidity": "#AA6746",
    "SourcePawn": "#f69e1d",
    "SPARQL": "#0C4597",
    "SpiceDB Schema": "#a5318a",
    "SQF": "#3F3F3F",
    "SQL": "#e38c00",
    "SQLPL": "#e38c00",
    "Squirrel": "#800000",
    "SRecode Template": "#348a34",
    "Stan": "#b2011d",
    "Standard ML": "#dc566d",
    "Starlark": "#76d275",
    "Stata": "#1a5f91",
    "STL": "#373b5e",
    "StringTemplate": "#3fb34f",
    "Stylus": "#ff6347",
    "SubRip Text": "#9e0101",
    "SugarSS": "#2fcc9f",
    "SuperCollider": "#46390b",
    "SurrealQL": "#ff00a0",
    "Survex data": "#ffcc99",
    "Svelte": "#ff3e00",
    "SVG": "#ff9900",
    "Sway": "#00F58C",
    "Sweave": "#198ce7",
    "Swift": "#F05138",
    "SystemVerilog": "#DAE1C2",
    "Tact": "#48b5ff",
    "Talon": "#333333",
    "Tcl": "#e4cc98",
    "Teal": "#00B1BC",
    "templ": "#66D0DD",
    "Terra": "#00004c",
    "Terraform Template": "#7b42bb",
    "TeX": "#3D6117",
    "TextGrid": "#c8506d",
    "Textile": "#ffe7ac",
    "TextMate Properties": "#df66e4",
    "Thrift": "#D12127",
    "TI Program": "#A0AA87",
    "TL-Verilog": "#C40023",
    "TLA": "#4b0079",
    "TMDL": "#f0c913",
    "Toit": "#c2c9fb",
    "Tolk": "#30A1F5",
    "TOML": "#9c4221",
    "Tor Config": "#59316b",
    "Tree-sitter Query": "#8ea64c",
    "TSQL": "#e38c00",
    "TSV": "#237346",
    "TSX": "#3178c6",
    "Turing": "#cf142b",
    "Twig": "#c1d026",
    "TXL": "#0178b8",
    "TypeScript": "#3178c6",
    "TypeSpec": "#4A3665",
    "Typst": "#239dad",
    "ucode": "#00b8d4",
    "Unified Parallel C": "#4e3617",
    "Unity3D Asset": "#222c37",
    "Uno": "#9933cc",
    "UnrealScript": "#a54c4d",
    "Untyped Plutus Core": "#36adbd",
    "UrWeb": "#ccccee",
    "V": "#4f87c4",
    "Vala": "#a56de2",
    "Valve Data Format": "#f26025",
    "VBA": "#867db1",
    "VBScript": "#15dcdc",
    "vCard": "#ee2647",
    "VCL": "#148AA8",
    "Velocity Template Language": "#507cff",
    "Vento": "#ff0080",
    "Verilog": "#b2b7f8",
    "Verse": "#518ef8",
    "Vespa Schema Definition": "#61D790",
    "VHDL": "#adb2cb",
    "Vim Help File": "#199f4b",
    "Vim script": "#199f4b",
    "Vim Snippet": "#199f4b",
    "Visual Basic .NET": "#945db7",
    "Visual Basic 6.0": "#2c6353",
    "Volt": "#1F1F1F",
    "Vue": "#41b883",
    "Vyper": "#9F4CF2",
    "WDL": "#42f1f4",
    "Web Ontology Language": "#5b70bd",
    "WebAssembly": "#04133b",
    "WebAssembly Interface Type": "#6250e7",
    "WGSL": "#1a5e9a",
    "Whiley": "#d5c397",
    "Wikitext": "#fc5757",
    "Windows Registry Entries": "#52d5ff",
    "wisp": "#7582D1",
    "Witcher Script": "#ff0000",
    "Wolfram Language": "#dd1100",
    "Wollok": "#a23738",
    "World of Warcraft Addon Data": "#f7e43f",
    "Wren": "#383838",
    "X10": "#4B6BEF",
    "xBase": "#403a40",
    "XC": "#99DA07",
    "Xmake": "#22a079",
    "XML": "#0060ac",
    "XML Property List": "#0060ac",
    "Xojo": "#81bd41",
    "Xonsh": "#285EEF",
    "XQuery": "#5232e7",
    "XSLT": "#EB8CEB",
    "Xtend": "#24255d",
    "Yacc": "#4B6C4B",
    "YAML": "#cb171e",
    "YARA": "#220000",
    "YASnippet": "#32AB90",
    "Yul": "#794932",
    "ZAP": "#0d665e",
    "ZenScript": "#00BCD1",
    "Zephir": "#118f9e",
    "Zig": "#ec915c",
    "ZIL": "#dc75e5",
    "Zimpl": "#d67711",
    "Zmodel": "#ff7100"
  };

  const COMPONENT_CSS = `
    :host {
      display: block;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.4;
    }
    *, *::before, *::after {
      box-sizing: inherit;
    }

    /* Theme: Light */
    :host([theme="light"]) .card,
    :host(:not([theme="dark"])) .card {
      --bg: #ffffff;
      --border: #e1e4e8;
      --title: #24292e;
      --text: #444d56;
      --subtext: #586069;
      --bar-bg: #eaecef;
      --hover-border: #0366d6;
      --shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    /* Theme: Dark */
    :host([theme="dark"]) .card {
      --bg: #0d1117;
      --border: #30363d;
      --title: #f0f6fc;
      --text: #c9d1d9;
      --subtext: #8b949e;
      --bar-bg: #21262d;
      --hover-border: #58a6ff;
      --shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    }

    /* Theme: Auto (Follow system) */
    @media (prefers-color-scheme: dark) {
      :host([theme="auto"]) .card,
      :host(:not([theme="dark"]):not([theme="light"])) .card {
        --bg: #0d1117;
        --border: #30363d;
        --title: #f0f6fc;
        --text: #c9d1d9;
        --subtext: #8b949e;
        --bar-bg: #21262d;
        --hover-border: #58a6ff;
        --shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
      }
    }

    .card {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 16px 18px;
      box-shadow: var(--shadow);
      color: var(--text);
      transition: border-color 0.2s ease;
    }
    .card:hover {
      border-color: var(--hover-border);
    }

    /* Header */
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }
    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 1px solid var(--border);
      flex-shrink: 0;
    }
    .title-group {
      min-width: 0;
    }
    .title {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: var(--title);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .username {
      font-size: 12px;
      color: var(--subtext);
    }
    .icon-link {
      color: var(--subtext);
      text-decoration: none;
      display: flex;
      align-items: center;
      transition: color 0.15s;
    }
    .icon-link:hover {
      color: var(--title);
    }

    /* Classic Bar */
    .bar {
      display: flex;
      height: 8px;
      width: 100%;
      border-radius: 4px;
      overflow: hidden;
      background: var(--bar-bg);
      margin-bottom: 14px;
    }
    .bar-seg {
      height: 100%;
    }
    .legend {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 10px 20px; /* Wider spacing between languages */
    }
    .legend-item {
      display: flex;
      align-items: center;
      font-size: 12px;
      min-width: 0;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 6px;
      flex-shrink: 0;
    }
    .lang-name {
      color: var(--text);
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 6px; /* Reduced gap between name and percentage */
    }
    .lang-pct {
      color: var(--subtext);
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 11.5px;
      flex-shrink: 0;
    }

    /* Donut Chart */
    .donut-wrap {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .donut-svg-wrap {
      position: relative;
      width: 90px;
      height: 90px;
      flex-shrink: 0;
    }
    .donut-svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }
    .donut-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 13px;
      font-weight: 700;
      color: var(--title);
      font-family: ui-monospace, monospace;
      text-align: center;
    }
    .donut-list {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }
    .donut-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
    }

    /* Compact / Slim Bar */
    .compact-bar {
      height: 6px;
      margin-top: 4px;
      margin-bottom: 8px; /* Reduced vertical margins */
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 14px; /* Reduced gap */
    }
    .chip {
      display: inline-flex;
      align-items: center;
      font-size: 11.5px;
      color: var(--text);
      /* Removed box container style */
    }
    .chip-name {
      margin-right: 5px; /* Space between language name and percentage */
    }
    .chip-pct {
      color: var(--subtext);
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    }

    /* States */
    .state-msg {
      padding: 20px;
      text-align: center;
      font-size: 13px;
      color: var(--subtext);
    }
    .error-msg {
      color: #cf222e;
      font-weight: 500;
    }
  `;

  // ===== HELPER FUNCTIONS =====
  function getLanguageColor(lang) {
    if (GITHUB_COLORS[lang]) return GITHUB_COLORS[lang];
    let hash = 0;
    for (let i = 0; i < lang.length; i++) hash = lang.charCodeAt(i) + ((hash << 5) - hash);
    return '#' + ('00000' + ((hash & 0x00FFFFFF) >>> 0).toString(16)).slice(-6);
  }

  function extractUsername(input) {
    if (!input) return '';
    return input.trim().replace(/^https?:\/\/(www\.)?github\.com\//i, '').replace(/^@/, '').split('/')[0].split('?')[0].trim();
  }

  function formatBytes(bytes) {
    if (!bytes) return '0 B';
    const k = 1024, s = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + s[i];
  }

  async function fetchStats(username, maxRepos = 18) {
    const user = extractUsername(username);
    if (!user) throw new Error('No GitHub Account ID');

    // Check cache
    const cacheKey = 'ghstat_' + user;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const item = JSON.parse(cached);
        if (Date.now() - item.time < 86400000) return item.data; // 24hrs cache
      }
    } catch (e) { }

    // User profile [fetch 1]
    const uRes = await fetch('https://api.github.com/users/' + encodeURIComponent(user));
    if (!uRes.ok) {
      if (uRes.status === 403) throw new Error('GitHub API Limit Reached');
      if (uRes.status === 404) throw new Error('No GitHub Account: @' + user);
      throw new Error('Profile Fetch Error (' + uRes.status + ')');
    }
    const userData = await uRes.json();

    // Repositories [fetch 1]
    const rRes = await fetch('https://api.github.com/users/' + encodeURIComponent(user) + '/repos?per_page=100&sort=pushed&type=owner');
    if (!rRes.ok) {
      if (rRes.status === 403) throw new Error('GitHub API Limit Reached');
      throw new Error('Repository Fetch Error (' + rRes.status + ')');
    }
    const repos = (await rRes.json()).filter(r => !r.fork);
    const targetRepos = repos.slice(0, maxRepos);

    // Languages byte breakdown [fetch maxRepos]
    const langPromises = targetRepos.map(async (r) => {
      const res = await fetch(r.languages_url);
      if (res.status === 403) throw new Error('GitHub API Limit Reached');
      if (!res.ok) return null;
      return res.json();
    });
    const results = await Promise.all(langPromises);
    const totals = {};
    let totalBytes = 0;

    // Calculate language totals
    for (const map of results) {
      if (map && typeof map === 'object') {
        for (const [lang, bytes] of Object.entries(map)) {
          if (typeof bytes === 'number' && bytes > 0) {
            totals[lang] = (totals[lang] || 0) + bytes;
            totalBytes += bytes;
          }
        }
      }
    }

    // Calculate language ratio
    const languages = Object.entries(totals)
      .map(([name, bytes]) => ({
        name,
        bytes,
        color: getLanguageColor(name),
        percentage: totalBytes > 0 ? (bytes / totalBytes) * 100 : 0
      }))
      .sort((a, b) => b.bytes - a.bytes);

    // Package data
    const data = {
      user: {
        login: userData.login,
        name: userData.name || userData.login,
        avatarUrl: userData.avatar_url,
        htmlUrl: userData.html_url
      },
      languages,
      totalBytes,
      repoCount: repos.length
    };

    // Save to cache
    try {
      localStorage.setItem(cacheKey, JSON.stringify({ time: Date.now(), data }));
    } catch (e) { }
    return data;
  }

  // ===== Custom Widget Element =====
  class GithubLangsElement extends HTMLElement {
    static get observedAttributes() {
      return ['username', 'theme', 'layout', 'limit', 'exclude', 'title'];
    }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._data = null;
      this._loading = false;
      this._error = null;
    }

    connectedCallback() {
      this.render();
      if (this.getAttribute('username')) this.loadData();
    }

    attributeChangedCallback(name, oldVal, newVal) {
      if (oldVal !== newVal) {
        if (name === 'username') this.loadData();
        else this.render();
      }
    }

    // Load stats
    async loadData() {
      const username = this.getAttribute('username');
      if (!username) return;
      this._loading = true;
      this._error = null;
      this.render();
      try {
        this._data = await fetchStats(username);
      } catch (err) {
        this._error = err.message || 'API Error';
      } finally {
        this._loading = false;
        this.render();
      }
    }

    // Render element
    render() {
      if (!this.shadowRoot) return;
      let content = '';

      if (this._loading) { // loading
        content = '<div class="card"><div class="state-msg">Analyzing GitHub Stats...</div></div>';
      } else if (this._error) { // load error
        content = `<div class="card"><div class="state-msg error-msg">⚠️ ${this.escape(this._error)}</div></div>`;

      } else if (this._data) { // draw stats
        const layout = this.getAttribute('layout') || 'classic';
        const limit = parseInt(this.getAttribute('limit') || '6', 10);
        const exclude = (this.getAttribute('exclude') || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
        const title = this.getAttribute('title') || `${this._data.user.name} Language Stats`;
        let langs = this._data.languages.filter(l => !exclude.includes(l.name.toLowerCase()));
        const total = langs.reduce((acc, l) => acc + l.bytes, 0);

        // Calculate percentage and Others stat
        let display = [];
        if (langs.length <= limit) {
          display = langs.map(l => ({ ...l, percentage: total > 0 ? (l.bytes / total) * 100 : 0 }));
        } else {
          const top = langs.slice(0, limit - 1).map(l => ({ ...l, percentage: total > 0 ? (l.bytes / total) * 100 : 0 }));
          const others = langs.slice(limit - 1);
          const otherBytes = others.reduce((a, b) => a + b.bytes, 0);
          display = [...top, { name: 'Other', bytes: otherBytes, color: '#8b949e', percentage: total > 0 ? (otherBytes / total) * 100 : 0 }];
        }

        // Buile HTML
        let bodyHtml = '';
        if (layout === 'donut') { // donut layout
          let cumPct = 0;
          const radius = 36;
          const circ = 2 * Math.PI * radius; // ~226.19
          const slices = display.map(l => {
            const dash = `${(l.percentage / 100) * circ} ${circ}`;
            const offset = -((cumPct / 100) * circ);
            cumPct += l.percentage;
            return `<circle cx="45" cy="45" r="${radius}" fill="none" stroke="${l.color}" stroke-width="12" stroke-dasharray="${dash}" stroke-dashoffset="${offset}" />`;
          }).join('');

          const list = display.map(l => `
            <div class="donut-row">
              <span style="display:flex;align-items:center;min-width:0;">
                <span class="dot" style="background:${l.color}"></span>
                <span class="lang-name">${this.escape(l.name)}</span>
              </span>
              <span class="lang-pct">${l.percentage.toFixed(1)}%</span>
            </div>
          `).join('');

          bodyHtml = `
            <div class="donut-wrap">
              <div class="donut-svg-wrap">
                <svg viewBox="0 0 90 90" class="donut-svg">
                  <circle cx="45" cy="45" r="${radius}" fill="none" stroke="var(--bar-bg)" stroke-width="12" />
                  ${slices}
                </svg>
                <div class="donut-center">${this._data.repoCount} Repos</div>
              </div>
              <div class="donut-list">${list}</div>
            </div>
          `;

        } else if (layout === 'compact') { // compact layout
          const segs = display.map(l => `<div class="bar-seg" style="width:${l.percentage.toFixed(2)}%;background:${l.color}" title="${this.escape(l.name)}: ${l.percentage.toFixed(1)}%"></div>`).join('');
          const chips = display.map(l => `
            <span class="chip">
              <span class="dot" style="background:${l.color}"></span>
              <span class="chip-name">${this.escape(l.name)}</span>
              <span class="chip-pct">${l.percentage.toFixed(1)}%</span>
            </span>
          `).join('');
          bodyHtml = `
            <div class="bar compact-bar">${segs}</div>
            <div class="chips">${chips}</div>
          `;

        } else { // classic layout
          const segs = display.map(l => `<div class="bar-seg" style="width:${l.percentage.toFixed(2)}%;background:${l.color}" title="${this.escape(l.name)}: ${l.percentage.toFixed(1)}%"></div>`).join('');
          const legend = display.map(l => `
            <div class="legend-item">
              <span class="dot" style="background:${l.color}"></span>
              <span class="lang-name">${this.escape(l.name)}</span>
              <span class="lang-pct">${l.percentage.toFixed(1)}%</span>
            </div>
          `).join('');
          bodyHtml = `
            <div class="bar">${segs}</div>
            <div class="legend">${legend}</div>
          `;
        }

        content = `
          <div class="card">
            <div class="header">
              <div class="user-info">
                <img src="${this.escape(this._data.user.avatarUrl)}" alt="${this.escape(this._data.user.login)}" class="avatar" loading="lazy" />
                <div class="title-group">
                  <h3 class="title">${this.escape(title)}</h3>
                  <span class="username">@${this.escape(this._data.user.login)}</span>
                </div>
              </div>
              <a href="${this.escape(this._data.user.htmlUrl)}" target="_blank" rel="noopener" class="icon-link" title="GitHub Profile">
                <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82 7.2 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                </svg>
              </a>
            </div>
            ${bodyHtml}
          </div>
        `;

      } else { // no data
        content = '<div class="card"><div class="state-msg">Set your GitHub ID</div></div>';
      }
      this.shadowRoot.innerHTML = `<style>${COMPONENT_CSS}</style>${content}`;
    }

    // HTML escape
    escape(str) {
      return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
  }

  // Define element
  if (!customElements.get('github-langs')) {
    customElements.define('github-langs', GithubLangsElement);
  }
  window.GithubLangs = {
    extractUsername,
    fetchStats
  };
})();
