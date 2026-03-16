from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import KeepTogether

OUTPUT = "D:/movie/claude_learning_guide.pdf"

doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=A4,
    leftMargin=18*mm,
    rightMargin=18*mm,
    topMargin=18*mm,
    bottomMargin=18*mm
)

W, H = A4
DARK   = colors.HexColor("#0f172a")
ACCENT = colors.HexColor("#6366f1")   # indigo
CARD   = colors.HexColor("#1e293b")
MUTED  = colors.HexColor("#64748b")
WHITE  = colors.HexColor("#f8fafc")
GREEN  = colors.HexColor("#10b981")
YELLOW = colors.HexColor("#f59e0b")
RED    = colors.HexColor("#ef4444")
BLUE   = colors.HexColor("#3b82f6")

styles = getSampleStyleSheet()

def S(name, **kw):
    return ParagraphStyle(name, **kw)

title_style = S("Title2", fontName="Helvetica-Bold", fontSize=26, textColor=WHITE,
                alignment=TA_CENTER, spaceAfter=4)
subtitle_style = S("Sub2", fontName="Helvetica", fontSize=11, textColor=colors.HexColor("#94a3b8"),
                   alignment=TA_CENTER, spaceAfter=2)
section_style = S("Sec", fontName="Helvetica-Bold", fontSize=14, textColor=ACCENT, spaceBefore=14, spaceAfter=6)
body_style = S("Body2", fontName="Helvetica", fontSize=10, textColor=WHITE, spaceAfter=4, leading=15)
url_style = S("URL", fontName="Helvetica", fontSize=9, textColor=colors.HexColor("#93c5fd"), spaceAfter=3, leading=13)
small_style = S("Small", fontName="Helvetica", fontSize=9, textColor=colors.HexColor("#94a3b8"), spaceAfter=3, leading=13)
tag_style = S("Tag", fontName="Helvetica-Bold", fontSize=9, textColor=WHITE, alignment=TA_CENTER)
bold_white = S("BW", fontName="Helvetica-Bold", fontSize=10, textColor=WHITE, spaceAfter=2)
bold_accent = S("BA", fontName="Helvetica-Bold", fontSize=10, textColor=ACCENT, spaceAfter=2)

story = []

# ── HEADER BANNER ──────────────────────────────────────────────────────────────
banner_data = [[Paragraph("Claude Developer Learning Guide", title_style)],
               [Paragraph("Everything you need to start building with Claude AI", subtitle_style)],
               [Paragraph("anthropic.com  •  Free Resources  •  Self-Paced", subtitle_style)]]
banner = Table(banner_data, colWidths=[W - 36*mm])
banner.setStyle(TableStyle([
    ("BACKGROUND",   (0,0), (-1,-1), DARK),
    ("TOPPADDING",   (0,0), (-1,0),  18),
    ("BOTTOMPADDING",(0,-1),(-1,-1), 16),
    ("LEFTPADDING",  (0,0), (-1,-1), 10),
    ("RIGHTPADDING", (0,0), (-1,-1), 10),
    ("ROUNDEDCORNERS", [8]),
    ("BOX", (0,0),(-1,-1), 2, ACCENT),
]))
story.append(banner)
story.append(Spacer(1, 10))

# ── QUICK NOTE ─────────────────────────────────────────────────────────────────
note_data = [[Paragraph(
    "📌  Anthropic has NO paid courses. Everything below is completely FREE. "
    "All URLs are official Anthropic documentation links — click any URL to open directly.",
    S("Note", fontName="Helvetica", fontSize=10, textColor=colors.HexColor("#fef3c7"), leading=15)
)]]
note = Table(note_data, colWidths=[W - 36*mm])
note.setStyle(TableStyle([
    ("BACKGROUND", (0,0),(-1,-1), colors.HexColor("#292524")),
    ("BOX", (0,0),(-1,-1), 1, YELLOW),
    ("LEFTPADDING",  (0,0),(-1,-1), 12),
    ("RIGHTPADDING", (0,0),(-1,-1), 12),
    ("TOPPADDING",   (0,0),(-1,-1), 10),
    ("BOTTOMPADDING",(0,0),(-1,-1), 10),
    ("ROUNDEDCORNERS", [6]),
]))
story.append(note)
story.append(Spacer(1, 12))

# ── HELPER: resource card ───────────────────────────────────────────────────────
def resource_card(number, title, url, desc, topics, border_color=ACCENT):
    num_p   = Paragraph(str(number), S("Num", fontName="Helvetica-Bold", fontSize=16,
                                        textColor=border_color, alignment=TA_CENTER))
    title_p = Paragraph(title, S("CT", fontName="Helvetica-Bold", fontSize=12, textColor=WHITE))
    url_p   = Paragraph(
        f'<link href="{url}"><u>{url}</u></link>',
        S("CU", fontName="Helvetica", fontSize=9, textColor=colors.HexColor("#93c5fd"), leading=13)
    )
    desc_p  = Paragraph(desc, S("CD", fontName="Helvetica", fontSize=10,
                                  textColor=colors.HexColor("#cbd5e1"), leading=14))

    # topics as small inline tags
    topic_cells = [[Paragraph(t, S("TP", fontName="Helvetica", fontSize=8,
                                    textColor=colors.HexColor("#e2e8f0"))) for t in topics]]
    topic_table = Table([topic_cells[0]], colWidths=[len(t)*6+14 for t in topics])
    topic_table.setStyle(TableStyle([
        ("BACKGROUND",   (0,0),(-1,-1), colors.HexColor("#334155")),
        ("TOPPADDING",   (0,0),(-1,-1), 3),
        ("BOTTOMPADDING",(0,0),(-1,-1), 3),
        ("LEFTPADDING",  (0,0),(-1,-1), 6),
        ("RIGHTPADDING", (0,0),(-1,-1), 6),
        ("ROUNDEDCORNERS", [4]),
    ]))

    inner = Table([
        [num_p, title_p],
        ["",    url_p],
        ["",    desc_p],
        ["",    topic_table],
    ], colWidths=[22, W - 36*mm - 22 - 10])
    inner.setStyle(TableStyle([
        ("VALIGN",      (0,0),(-1,-1), "TOP"),
        ("SPAN",        (0,0),(0,-1)),
        ("TOPPADDING",  (0,0),(-1,-1), 2),
        ("BOTTOMPADDING",(0,0),(-1,-1), 3),
        ("LEFTPADDING", (0,0),(-1,-1), 0),
        ("RIGHTPADDING",(0,0),(-1,-1), 0),
    ]))

    outer = Table([[inner]], colWidths=[W - 36*mm])
    outer.setStyle(TableStyle([
        ("BACKGROUND",   (0,0),(-1,-1), CARD),
        ("BOX",          (0,0),(-1,-1), 0, colors.transparent),
        ("LINEBEFORE",   (0,0),(0,-1),  4, border_color),
        ("TOPPADDING",   (0,0),(-1,-1), 12),
        ("BOTTOMPADDING",(0,0),(-1,-1), 12),
        ("LEFTPADDING",  (0,0),(-1,-1), 14),
        ("RIGHTPADDING", (0,0),(-1,-1), 12),
        ("ROUNDEDCORNERS", [6]),
    ]))
    return outer


# ══════════════════════════════════════════════════════════════════════════════
# SECTION 1 — CORE DOCS
# ══════════════════════════════════════════════════════════════════════════════
story.append(Paragraph("1.  Core Official Documentation", section_style))
story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#1e293b"), spaceAfter=6))

resources = [
    (1, "Claude API Documentation",
     "https://platform.claude.com/docs",
     "The main developer hub. 650+ pages covering everything from your first API call to advanced "
     "agentic systems. Start here — read the Quickstart, then explore topics as you need them.",
     ["API", "Quickstart", "Prompt Eng.", "Tool Use", "Vision", "Streaming"], ACCENT),

    (2, "Claude Code Documentation",
     "https://code.claude.com/docs",
     "Official docs for the Claude Code CLI tool (what you are using right now). Covers workflows, "
     "IDE integrations, subagents, hooks, slash commands, and MCP servers.",
     ["CLI", "IDE", "Subagents", "Hooks", "MCP"], GREEN),

    (3, "Agent SDK — Python & TypeScript",
     "https://platform.claude.com/docs/en/agent-sdk/quickstart.md",
     "Build autonomous AI agents that use custom tools, manage sessions, and run multi-step tasks. "
     "Official SDK for Python and TypeScript with full examples.",
     ["Agents", "Python", "TypeScript", "Tools", "Sessions", "Deploy"], YELLOW),

    (4, "Anthropic API Reference",
     "https://platform.claude.com/docs/api-reference",
     "Full REST API reference — every endpoint, parameter, request body, and response schema "
     "documented with runnable examples. Bookmark this.",
     ["REST", "Endpoints", "Params", "Schemas"], BLUE),
]

for r in resources:
    story.append(KeepTogether(resource_card(*r)))
    story.append(Spacer(1, 8))

story.append(Spacer(1, 4))

# ══════════════════════════════════════════════════════════════════════════════
# SECTION 2 — TOPICS INSIDE THE DOCS
# ══════════════════════════════════════════════════════════════════════════════
story.append(Paragraph("2.  Key Topics Inside the Docs (Learn In This Order)", section_style))
story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#1e293b"), spaceAfter=6))

topic_rows = [
    ("Step", "Topic", "Direct URL", "Why It Matters"),
    ("1", "Quickstart",
     "platform.claude.com/docs/quickstart",
     "First API call in 5 minutes"),
    ("2", "Prompt Engineering",
     "platform.claude.com/docs/build-with-claude/prompt-engineering/overview",
     "How to write prompts that actually work"),
    ("3", "Tool Use",
     "platform.claude.com/docs/build-with-claude/tool-use/overview",
     "Let Claude call functions & external APIs"),
    ("4", "Vision & Images",
     "platform.claude.com/docs/build-with-claude/vision",
     "Send images to Claude, get analysis back"),
    ("5", "Streaming",
     "platform.claude.com/docs/build-with-claude/streaming",
     "Real-time token streaming (like ChatGPT typing)"),
    ("6", "Extended Thinking",
     "platform.claude.com/docs/build-with-claude/extended-thinking",
     "Claude's reasoning / chain-of-thought mode"),
    ("7", "Structured Output",
     "platform.claude.com/docs/build-with-claude/structured-outputs",
     "Get JSON back reliably"),
    ("8", "MCP (Model Context Protocol)",
     "platform.claude.com/docs/build-with-claude/mcp",
     "Connect Claude to databases, APIs, tools"),
    ("9", "Agent Patterns",
     "platform.claude.com/docs/build-with-claude/agents-and-tools/overview",
     "Design multi-step autonomous agents"),
    ("10", "Rate Limits & Pricing",
     "platform.claude.com/docs/about-claude/models/overview",
     "Know costs before you ship to prod"),
]

col_w = [(W - 36*mm) * x for x in [0.07, 0.22, 0.44, 0.27]]
t = Table(topic_rows, colWidths=col_w)
t.setStyle(TableStyle([
    # Header
    ("BACKGROUND",   (0,0),(-1,0),  ACCENT),
    ("TEXTCOLOR",    (0,0),(-1,0),  WHITE),
    ("FONTNAME",     (0,0),(-1,0),  "Helvetica-Bold"),
    ("FONTSIZE",     (0,0),(-1,0),  9),
    ("TOPPADDING",   (0,0),(-1,0),  8),
    ("BOTTOMPADDING",(0,0),(-1,0),  8),
    # Alternating rows
    *[("BACKGROUND", (0,i),(-1,i), colors.HexColor("#1e293b") if i%2==1 else CARD)
      for i in range(1, len(topic_rows))],
    ("TEXTCOLOR",    (0,1),(-1,-1), colors.HexColor("#e2e8f0")),
    ("FONTNAME",     (0,1),(-1,-1), "Helvetica"),
    ("FONTSIZE",     (0,1),(-1,-1), 9),
    ("TOPPADDING",   (0,1),(-1,-1), 6),
    ("BOTTOMPADDING",(0,1),(-1,-1), 6),
    ("LEFTPADDING",  (0,0),(-1,-1), 8),
    ("RIGHTPADDING", (0,0),(-1,-1), 8),
    ("ALIGN",        (0,0),(0,-1),  "CENTER"),
    ("VALIGN",       (0,0),(-1,-1), "MIDDLE"),
    ("GRID",         (0,0),(-1,-1), 0.5, colors.HexColor("#334155")),
    ("ROUNDEDCORNERS", [6]),
]))
story.append(t)
story.append(Spacer(1, 14))

# ══════════════════════════════════════════════════════════════════════════════
# SECTION 3 — SDKs
# ══════════════════════════════════════════════════════════════════════════════
story.append(Paragraph("3.  Official SDKs (Pick Your Language)", section_style))
story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#1e293b"), spaceAfter=6))

sdk_rows = [
    ("Language", "Install Command", "GitHub / Docs URL"),
    ("Python",     "pip install anthropic",                     "github.com/anthropics/anthropic-sdk-python"),
    ("TypeScript", "npm install @anthropic-ai/sdk",             "github.com/anthropics/anthropic-sdk-typescript"),
    ("Go",         "go get github.com/anthropics/anthropic-sdk-go", "github.com/anthropics/anthropic-sdk-go"),
    ("Java",       "Maven / Gradle — see docs",                  "github.com/anthropics/anthropic-sdk-java"),
    ("C#",         "dotnet add package Anthropic.SDK",           "github.com/anthropics/anthropic-sdk-dotnet"),
    ("Ruby",       "gem install anthropic",                      "github.com/anthropics/anthropic-sdk-ruby"),
    ("PHP",        "composer require anthropics/anthropic-php",  "github.com/anthropics/anthropic-sdk-php"),
]

sdk_col_w = [(W - 36*mm) * x for x in [0.15, 0.35, 0.50]]
st = Table(sdk_rows, colWidths=sdk_col_w)
st.setStyle(TableStyle([
    ("BACKGROUND",   (0,0),(-1,0),  colors.HexColor("#4f46e5")),
    ("TEXTCOLOR",    (0,0),(-1,0),  WHITE),
    ("FONTNAME",     (0,0),(-1,0),  "Helvetica-Bold"),
    ("FONTSIZE",     (0,0),(-1,0),  9),
    ("TOPPADDING",   (0,0),(-1,0),  8),
    ("BOTTOMPADDING",(0,0),(-1,0),  8),
    *[("BACKGROUND", (0,i),(-1,i), colors.HexColor("#1e293b") if i%2==1 else CARD)
      for i in range(1, len(sdk_rows))],
    ("TEXTCOLOR",    (0,1),(-1,-1), colors.HexColor("#e2e8f0")),
    ("FONTNAME",     (0,1),(-1,-1), "Helvetica"),
    ("FONTSIZE",     (0,1),(-1,-1), 9),
    ("TOPPADDING",   (0,1),(-1,-1), 6),
    ("BOTTOMPADDING",(0,1),(-1,-1), 6),
    ("LEFTPADDING",  (0,0),(-1,-1), 8),
    ("RIGHTPADDING", (0,0),(-1,-1), 8),
    ("VALIGN",       (0,0),(-1,-1), "MIDDLE"),
    ("GRID",         (0,0),(-1,-1), 0.5, colors.HexColor("#334155")),
    ("ROUNDEDCORNERS", [6]),
]))
story.append(st)
story.append(Spacer(1, 14))

# ══════════════════════════════════════════════════════════════════════════════
# SECTION 4 — RECOMMENDED LEARNING PATH
# ══════════════════════════════════════════════════════════════════════════════
story.append(Paragraph("4.  Recommended Learning Path (Week by Week)", section_style))
story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#1e293b"), spaceAfter=6))

week_data = [
    ("Week", "Focus", "What To Build", "Color"),
    ("Week 1", "API Basics + Prompt Engineering",
     "A simple chatbot that answers questions about movies", GREEN),
    ("Week 2", "Tool Use + Structured Output",
     "A movie recommender that calls your own backend API", YELLOW),
    ("Week 3", "Streaming + Vision",
     "Upload a movie poster → get AI description back in real-time", BLUE),
    ("Week 4", "Agent SDK + MCP",
     "An autonomous agent that books a ticket end-to-end", ACCENT),
]

for w in week_data[1:]:
    row_data = [[
        Paragraph(w[0], S("WN", fontName="Helvetica-Bold", fontSize=10, textColor=w[3])),
        Paragraph(w[1], S("WF", fontName="Helvetica-Bold", fontSize=10, textColor=WHITE)),
        Paragraph(f"🔨 {w[2]}", S("WB", fontName="Helvetica", fontSize=9,
                                    textColor=colors.HexColor("#94a3b8"), leading=13)),
    ]]
    wt = Table(row_data, colWidths=[(W-36*mm)*x for x in [0.16, 0.38, 0.46]])
    wt.setStyle(TableStyle([
        ("BACKGROUND",   (0,0),(-1,-1), CARD),
        ("LINEBEFORE",   (0,0),(0,-1),  4, w[3]),
        ("TOPPADDING",   (0,0),(-1,-1), 10),
        ("BOTTOMPADDING",(0,0),(-1,-1), 10),
        ("LEFTPADDING",  (0,0),(-1,-1), 12),
        ("RIGHTPADDING", (0,0),(-1,-1), 10),
        ("VALIGN",       (0,0),(-1,-1), "MIDDLE"),
        ("ROUNDEDCORNERS", [6]),
    ]))
    story.append(wt)
    story.append(Spacer(1, 6))

story.append(Spacer(1, 10))

# ══════════════════════════════════════════════════════════════════════════════
# SECTION 5 — EXTRA RESOURCES
# ══════════════════════════════════════════════════════════════════════════════
story.append(Paragraph("5.  Extra Resources", section_style))
story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#1e293b"), spaceAfter=6))

extra = [
    ("Anthropic Blog",         "anthropic.com/news",                   "Research updates, model releases, safety papers"),
    ("Anthropic Cookbook",     "github.com/anthropics/anthropic-cookbook", "100+ practical code recipes"),
    ("Model Overview & Prices","platform.claude.com/docs/about-claude/models/overview", "Latest Claude models, context windows, pricing"),
    ("Claude Prompt Library",  "platform.claude.com/docs/build-with-claude/prompt-library", "Pre-built prompt templates for common tasks"),
    ("Discord Community",      "discord.gg/anthropic",                  "Ask questions, share projects, get unstuck"),
    ("Status Page",            "status.anthropic.com",                   "Check API uptime before blaming your code"),
]

for name, url, desc in extra:
    row = [[
        Paragraph(f"<b>{name}</b>", S("EN", fontName="Helvetica-Bold", fontSize=10, textColor=WHITE)),
        Paragraph(f'<link href="https://{url}"><u>{url}</u></link>',
                  S("EU", fontName="Helvetica", fontSize=9, textColor=colors.HexColor("#93c5fd"), leading=13)),
        Paragraph(desc, S("ED", fontName="Helvetica", fontSize=9,
                           textColor=colors.HexColor("#94a3b8"), leading=13)),
    ]]
    et = Table(row, colWidths=[(W-36*mm)*x for x in [0.22, 0.40, 0.38]])
    et.setStyle(TableStyle([
        ("BACKGROUND",   (0,0),(-1,-1), CARD),
        ("TOPPADDING",   (0,0),(-1,-1), 8),
        ("BOTTOMPADDING",(0,0),(-1,-1), 8),
        ("LEFTPADDING",  (0,0),(-1,-1), 10),
        ("RIGHTPADDING", (0,0),(-1,-1), 10),
        ("VALIGN",       (0,0),(-1,-1), "MIDDLE"),
        ("ROUNDEDCORNERS", [4]),
    ]))
    story.append(et)
    story.append(Spacer(1, 5))

story.append(Spacer(1, 14))

# ── FOOTER ─────────────────────────────────────────────────────────────────────
footer_data = [[Paragraph(
    "All resources are free  •  No account required to read docs  •  "
    "API key needed only to run code  •  Get your key at console.anthropic.com",
    S("F", fontName="Helvetica", fontSize=9, textColor=colors.HexColor("#64748b"),
      alignment=TA_CENTER, leading=14)
)]]
ft = Table(footer_data, colWidths=[W - 36*mm])
ft.setStyle(TableStyle([
    ("BACKGROUND",   (0,0),(-1,-1), colors.HexColor("#0f172a")),
    ("BOX",          (0,0),(-1,-1), 1, colors.HexColor("#334155")),
    ("TOPPADDING",   (0,0),(-1,-1), 10),
    ("BOTTOMPADDING",(0,0),(-1,-1), 10),
    ("LEFTPADDING",  (0,0),(-1,-1), 12),
    ("RIGHTPADDING", (0,0),(-1,-1), 12),
    ("ROUNDEDCORNERS", [6]),
]))
story.append(ft)

# ── BUILD ───────────────────────────────────────────────────────────────────────
doc.build(story)
print(f"PDF saved: {OUTPUT}")
