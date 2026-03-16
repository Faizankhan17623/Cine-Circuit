from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer,
                                 ListFlowable, ListItem, PageBreak, Flowable)
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.pdfgen import canvas as pdfcanvas
from reportlab.graphics.shapes import (Drawing, Rect, Circle, Ellipse,
                                        String, Line, Polygon)
from reportlab.graphics import renderPDF
import math

PAGE_W, PAGE_H = A4
BORDER_M = 0.5 * inch
CONTENT_M = inch

# ── Border ───────────────────────────────────────────────────
class BorderCanvas(pdfcanvas.Canvas):
    def showPage(self):
        self._border(); super().showPage()
    def save(self):
        self._border(); super().save()
    def _border(self):
        self.setLineWidth(1.5)
        self.rect(BORDER_M, BORDER_M, PAGE_W-2*BORDER_M, PAGE_H-2*BORDER_M)

# ── Styles ───────────────────────────────────────────────────
styles = getSampleStyleSheet()
def S(n, p='Normal', **k): return ParagraphStyle(n, parent=styles[p], **k)

T1   = S('T1',  fontSize=14, fontName='Helvetica-Bold', alignment=TA_CENTER, spaceAfter=4)
T2   = S('T2',  fontSize=11, fontName='Helvetica-Bold', alignment=TA_CENTER, spaceAfter=4)
T3   = S('T3',  fontSize=11, alignment=TA_CENTER, spaceAfter=4)
PT   = S('PT',  fontSize=22, fontName='Helvetica-Bold', alignment=TA_CENTER, spaceAfter=6)
SH   = S('SH',  fontSize=13, fontName='Helvetica-Bold', alignment=TA_CENTER, spaceBefore=10, spaceAfter=8)
SbH  = S('SbH', fontSize=11, fontName='Helvetica-Bold',
         textColor=colors.HexColor('#1a5276'), spaceBefore=8, spaceAfter=4)
BD   = S('BD',  fontSize=11, leading=18, alignment=TA_JUSTIFY, spaceAfter=8)
BL   = S('BL',  fontSize=11, leading=16, leftIndent=20, spaceAfter=2)
CAP  = S('CAP', fontSize=10, fontName='Helvetica-Bold', alignment=TA_CENTER,
         textColor=colors.HexColor('#2c3e50'), spaceBefore=6, spaceAfter=10)

def blist(items):
    return ListFlowable([ListItem(Paragraph(i, BL), bulletColor=colors.black, leftIndent=20) for i in items],
                        bulletType='bullet', start='•', leftIndent=20)
def nlist(items):
    return ListFlowable([ListItem(Paragraph(i, BL), leftIndent=20) for i in items],
                        bulletType='1', leftIndent=20)

# ── Colors ───────────────────────────────────────────────────
BLUE=colors.HexColor('#1a5276'); LBLUE=colors.HexColor('#aed6f1')
GREEN=colors.HexColor('#1e8449'); LGREEN=colors.HexColor('#a9dfbf')
ORANGE=colors.HexColor('#d35400'); LGOLD=colors.HexColor('#fdebd0')
GREY=colors.HexColor('#95a5a6'); LGREY=colors.HexColor('#ecf0f1')
DBLUE=colors.HexColor('#154360'); WHITE=colors.white; BLACK=colors.black
RED=colors.HexColor('#922b21'); LRED=colors.HexColor('#fadbd8')
PURPLE=colors.HexColor('#6c3483'); LPURPLE=colors.HexColor('#e8daef')

# ── Drawing helpers ──────────────────────────────────────────
def box(d,x,y,w,h,fill=LBLUE,stroke=BLUE,text='',fs=9,bold=False,radius=4):
    d.add(Rect(x,y,w,h,rx=radius,ry=radius,fillColor=fill,strokeColor=stroke,strokeWidth=1))
    if text:
        fn='Helvetica-Bold' if bold else 'Helvetica'
        lines=text.split('\n'); lh=fs+2; tot=len(lines)*lh
        sy=y+h/2+tot/2-lh+2
        for i,l in enumerate(lines):
            d.add(String(x+w/2,sy-i*lh,l,fontSize=fs,fontName=fn,fillColor=BLACK,textAnchor='middle'))

def oval(d,cx,cy,rx,ry,fill=LBLUE,stroke=BLUE,text='',fs=8):
    d.add(Ellipse(cx,cy,rx,ry,fillColor=fill,strokeColor=stroke,strokeWidth=1))
    if text:
        d.add(String(cx,cy-fs/2+1,text,fontSize=fs,fontName='Helvetica',fillColor=BLACK,textAnchor='middle'))

def actor(d,cx,by,label='',fs=8):
    d.add(Circle(cx,by+50,8,fillColor=LGREY,strokeColor=DBLUE,strokeWidth=1))
    d.add(Line(cx,by+42,cx,by+20,strokeColor=DBLUE,strokeWidth=1.5))
    d.add(Line(cx-12,by+35,cx+12,by+35,strokeColor=DBLUE,strokeWidth=1.5))
    d.add(Line(cx,by+20,cx-10,by+5,strokeColor=DBLUE,strokeWidth=1.5))
    d.add(Line(cx,by+20,cx+10,by+5,strokeColor=DBLUE,strokeWidth=1.5))
    if label:
        d.add(String(cx,by-2,label,fontSize=fs,fontName='Helvetica-Bold',fillColor=DBLUE,textAnchor='middle'))

def arrow(d,x1,y1,x2,y2,color=BLUE,label='',fs=7):
    d.add(Line(x1,y1,x2,y2,strokeColor=color,strokeWidth=1))
    angle=math.atan2(y2-y1,x2-x1); sz=7
    ax=x2-sz*math.cos(angle-0.4); ay=y2-sz*math.sin(angle-0.4)
    bx=x2-sz*math.cos(angle+0.4); by_=y2-sz*math.sin(angle+0.4)
    d.add(Polygon([x2,y2,ax,ay,bx,by_],fillColor=color,strokeColor=color,strokeWidth=0.5))
    if label:
        d.add(String((x1+x2)/2,(y1+y2)/2+3,label,fontSize=fs,fontName='Helvetica',fillColor=color,textAnchor='middle'))

def dash(d,x1,y1,x2,y2,color=GREY):
    d.add(Line(x1,y1,x2,y2,strokeColor=color,strokeWidth=0.8,strokeDashArray=[4,3]))

def diamond(d,cx,cy,w,h,fill=LGOLD,stroke=ORANGE,text='',fs=8):
    hw,hh=w/2,h/2
    d.add(Polygon([cx,cy+hh,cx+hw,cy,cx,cy-hh,cx-hw,cy],fillColor=fill,strokeColor=stroke,strokeWidth=1))
    if text:
        d.add(String(cx,cy-fs/2+1,text,fontSize=fs,fontName='Helvetica-Bold',fillColor=BLACK,textAnchor='middle'))

# ═══════════════════════════════════════════════════
# DIAGRAM 1: Use Case Diagram (4 actors)
# ═══════════════════════════════════════════════════
def make_usecase():
    W,H=500,500
    d=Drawing(W,H)
    d.add(Rect(0,0,W,H,fillColor=colors.HexColor('#f8f9fa'),strokeColor=WHITE,strokeWidth=0))
    # System boundary
    d.add(Rect(80,15,W-165,H-35,rx=8,ry=8,fillColor=WHITE,strokeColor=BLUE,strokeWidth=1.5))
    d.add(String(W/2-40,H-18,'Cine Circuit — System Boundary',fontSize=9,fontName='Helvetica-Bold',fillColor=BLUE,textAnchor='middle'))
    # 4 actors
    actor(d,28,405,'Viewer',8)
    actor(d,28,250,'Organizer',8)
    actor(d,28,110,'Theatrer',8)
    actor(d,468,280,'Admin',8)
    # Use cases — left side (Viewer + Organizer + Theatrer)
    UCS=[
        # x, y, label
        (185,460,'Register / Login'),
        (185,420,'Browse Movies'),
        (185,382,'Search Shows'),
        (185,344,'Select & Book Seats'),
        (185,306,'Make Payment (Razorpay)'),
        (185,268,'View / Download Ticket'),
        (185,230,'Like / Dislike Movie'),
        (185,192,'Post Comments & Reviews'),
        (185,154,'Add to Wishlist'),
        (185,116,'AI Movie Recommendations'),
        (185, 78,'Submit Bug Report'),
        # Organizer
        (330,420,'Create Show'),
        (330,382,'Upload Poster/Trailer'),
        (330,344,'Manage Cast & Tags'),
        (330,306,'Create Ticket Slots'),
        (330,268,'Allot Theatre'),
        (330,230,'Submit Org Verification'),
        # Theatrer
        (330,192,'Distribute Tickets'),
        (330,154,'View Total Sales'),
        (330,116,'Update Show Timings'),
        # Admin
        (330, 78,'Verify Shows/Org/Theatres'),
        (330, 40,'Manage Genre/Language'),
    ]
    for cx,cy,label in UCS:
        oval(d,cx,cy,72,13,fill=LBLUE,stroke=BLUE,text=label,fs=6.5)
    # Actor lines — Viewer
    for cy in [460,420,382,344,306,268,230,192,154,116,78]:
        d.add(Line(50,430,113,cy,strokeColor=GREY,strokeWidth=0.6))
    # Organizer
    for cy in [420,382,344,306,268,230]:
        d.add(Line(50,275,258,cy,strokeColor=GREY,strokeWidth=0.6))
    # Theatrer
    for cy in [192,154,116]:
        d.add(Line(50,135,258,cy,strokeColor=GREY,strokeWidth=0.6))
    # Admin
    for cy in [420,306,230,78,40]:
        d.add(Line(445,305,402,cy,strokeColor=GREY,strokeWidth=0.6))
    return d

# ═══════════════════════════════════════════════════
# DIAGRAM 2: Activity Diagram
# ═══════════════════════════════════════════════════
def make_activity():
    W,H=320,620
    d=Drawing(W,H)
    d.add(Rect(0,0,W,H,fillColor=colors.HexColor('#f8f9fa'),strokeColor=WHITE,strokeWidth=0))
    cx=W//2
    # Start
    d.add(Circle(cx,600,11,fillColor=DBLUE,strokeColor=DBLUE))
    steps=[
        (575,'User Registers / Logs In'),
        (535,'Browse Movies & Shows'),
        (495,'Select Show, Date & Theatre'),
        (455,'Choose Number of Tickets'),
    ]
    for y,label in steps:
        box(d,cx-80,y-12,160,24,fill=LBLUE,stroke=BLUE,text=label,fs=7.5)
    arrow(d,cx,600-11,cx,587,color=BLUE)
    for i in range(len(steps)-1):
        arrow(d,cx,steps[i][0]-12,cx,steps[i+1][0]+12,color=BLUE)
    arrow(d,cx,455-12,cx,435,color=BLUE)
    # Decision 1
    diamond(d,cx,418,140,30,fill=LGOLD,stroke=ORANGE,text='Seats Available?',fs=8)
    # No
    arrow(d,cx-70,418,cx-70,500,color=ORANGE)
    d.add(String(cx-63,460,'No',fontSize=8,fontName='Helvetica',fillColor=ORANGE,textAnchor='start'))
    box(d,cx-155,500,160,24,fill=LRED,stroke=RED,text='Show Error / Try Again',fs=7.5)
    # Yes
    arrow(d,cx+70,418,cx+70,388,color=GREEN)
    d.add(String(cx+73,404,'Yes',fontSize=8,fontName='Helvetica',fillColor=GREEN,textAnchor='start'))
    box(d,cx-10,364,160,24,fill=LGREEN,stroke=GREEN,text='Proceed to Razorpay',fs=7.5)
    arrow(d,cx+70,364,cx+70,344,color=GREEN)
    arrow(d,cx+70,344,cx,344,color=GREEN)
    arrow(d,cx,344,cx,324,color=BLUE)
    # Decision 2
    diamond(d,cx,308,140,28,fill=LGOLD,stroke=ORANGE,text='Payment Success?',fs=8)
    # Yes
    arrow(d,cx+70,308,cx+70,278,color=GREEN)
    d.add(String(cx+73,294,'Yes',fontSize=8,fontName='Helvetica',fillColor=GREEN,textAnchor='start'))
    box(d,cx-10,254,160,24,fill=LGREEN,stroke=GREEN,text='Generate Ticket + QR',fs=7.5)
    arrow(d,cx+70,254,cx+70,234,color=GREEN)
    box(d,cx-10,210,160,24,fill=LGREEN,stroke=GREEN,text='Send Booking Email',fs=7.5)
    arrow(d,cx+70,210,cx+70,190,color=GREEN)
    arrow(d,cx+70,190,cx,190,color=GREEN)
    arrow(d,cx,190,cx,170,color=BLUE)
    # No
    arrow(d,cx-70,308,cx-70,258,color=RED)
    d.add(String(cx-100,280,'No',fontSize=8,fontName='Helvetica',fillColor=RED,textAnchor='start'))
    box(d,cx-155,234,155,24,fill=LRED,stroke=RED,text='Payment Failed Email',fs=7.5)
    arrow(d,cx-75,234,cx-75,190,color=RED)
    arrow(d,cx-75,190,cx,190,color=RED)
    # Show ticket
    box(d,cx-80,146,160,24,fill=LBLUE,stroke=BLUE,text='Show Ticket Page',fs=7.5)
    arrow(d,cx,170,cx,170,color=BLUE)
    arrow(d,cx,146,cx,126,color=BLUE)
    # Option to cancel
    box(d,cx-80,102,160,24,fill=LPURPLE,stroke=PURPLE,text='Option: Cancel Ticket',fs=7.5)
    arrow(d,cx,102,cx,82,color=BLUE)
    box(d,cx-80,58,160,24,fill=LPURPLE,stroke=PURPLE,text='Seat Released + Refund',fs=7.5)
    arrow(d,cx,58,cx,40,color=BLUE)
    # End
    d.add(Circle(cx,26,9,fillColor=DBLUE,strokeColor=DBLUE))
    d.add(Circle(cx,26,13,fillColor=WHITE,strokeColor=DBLUE,strokeWidth=2))
    return d

# ═══════════════════════════════════════════════════
# DIAGRAM 3: Sequence Diagram
# ═══════════════════════════════════════════════════
def make_sequence():
    W,H=500,540
    d=Drawing(W,H)
    d.add(Rect(0,0,W,H,fillColor=colors.HexColor('#f8f9fa'),strokeColor=WHITE,strokeWidth=0))
    cols={'User':50,'Browser':145,'Backend':265,'MongoDB':375,'Razorpay':470}
    top=H-30; bot=30
    for name,cx in cols.items():
        box(d,cx-32,top-20,64,20,fill=LBLUE,stroke=BLUE,text=name,fs=8,bold=True)
        dash(d,cx,top-20,cx,bot,color=GREY)
    msgs=[
        (500,'User','Browser','Select show + seats',False),
        (470,'Browser','Backend','POST /Make-Payment',False),
        (440,'Backend','MongoDB','Check seat availability',False),
        (410,'MongoDB','Backend','Seats OK (return data)',True),
        (380,'Backend','Razorpay','Create Razorpay Order',False),
        (350,'Razorpay','Backend','Order ID returned',True),
        (320,'Backend','Browser','Return order details',True),
        (290,'Browser','Razorpay','Open payment modal',False),
        (260,'Razorpay','Browser','Payment token (success)',True),
        (230,'Browser','Backend','POST /Verify-Payment',False),
        (200,'Backend','MongoDB','Atomic seat lock + save',False),
        (170,'MongoDB','Backend','Booking saved OK',True),
        (140,'Backend','User','Email: Booking Confirmation',True),
        (110,'Backend','Browser','Ticket data + 200 OK',True),
        ( 80,'Browser','User','Render Ticket + QR Code',True),
    ]
    for y,frm,to,label,dashed in msgs:
        x1=cols[frm]; x2=cols[to]
        col=GREY if dashed else BLUE
        if dashed:
            dash(d,x1,y,x2,y,color=col)
            if x2>x1: d.add(Polygon([x2,y,x2-7,y+3,x2-7,y-3],fillColor=col,strokeColor=col))
            else:      d.add(Polygon([x2,y,x2+7,y+3,x2+7,y-3],fillColor=col,strokeColor=col))
        else:
            arrow(d,x1,y,x2,y,color=col)
        d.add(String((x1+x2)/2,y+3,label,fontSize=6.5,fontName='Helvetica',fillColor=BLACK,textAnchor='middle'))
    # Backend activation
    d.add(Rect(cols['Backend']-4,80,8,430,fillColor=LBLUE,strokeColor=BLUE,strokeWidth=0.5))
    return d

# ═══════════════════════════════════════════════════
# DIAGRAM 4: ER / Database Diagram
# ═══════════════════════════════════════════════════
def make_er():
    W,H=520,560
    d=Drawing(W,H)
    d.add(Rect(0,0,W,H,fillColor=colors.HexColor('#f8f9fa'),strokeColor=WHITE,strokeWidth=0))
    BW,BH=105,80
    ents={
        'User':      (10,  450),
        'Show':      (125, 450),
        'Genre':     (240, 450),
        'Theatre':   (355, 450),
        'Organizer': (10,  310),
        'Ticket':    (125, 310),
        'Payment':   (240, 310),
        'Language':  (355, 310),
        'Cast':      (10,  170),
        'Comment':   (125, 170),
        'Rating':    (240, 170),
        'BugReport': (355, 170),
        'OTP':       (10,   30),
        'Maintenance':(125,  30),
        'Feedback':  (240,  30),
        'Visitor':   (355,  30),
    }
    flds={
        'User':      ['_id','userName','email','usertype','verified'],
        'Show':      ['_id','title','genre','language','status'],
        'Genre':     ['_id','genreName','subgenres[]'],
        'Theatre':   ['_id','locationName','Owner','status'],
        'Organizer': ['_id','user','Role','ExperienceLevel','status'],
        'Ticket':    ['_id','showid','theatreId','category','price'],
        'Payment':   ['_id','userid','showid','razorpay_id','status'],
        'Language':  ['_id','langname'],
        'Cast':      ['_id','name','userid','images'],
        'Comment':   ['_id','Showid','userId','data'],
        'Rating':    ['_id','user','rating','review','course'],
        'BugReport': ['_id','bugId','title','status','reportedBy'],
        'OTP':       ['_id','otp','email','createdAt (TTL)'],
        'Maintenance':['_id','isActive','message','endTime'],
        'Feedback':  ['_id','firstName','email','message'],
        'Visitor':   ['_id','ip','visitCount','lastVisited'],
    }
    colors_map={
        'User':BLUE,'Show':BLUE,'Genre':BLUE,'Theatre':BLUE,
        'Organizer':GREEN,'Ticket':GREEN,'Payment':GREEN,'Language':GREEN,
        'Cast':ORANGE,'Comment':ORANGE,'Rating':ORANGE,'BugReport':ORANGE,
        'OTP':PURPLE,'Maintenance':PURPLE,'Feedback':PURPLE,'Visitor':PURPLE,
    }
    positions={}
    for name,(x,y) in ents.items():
        positions[name]=(x,y)
        hc=colors_map[name]
        d.add(Rect(x,y+BH-20,BW,20,rx=3,ry=3,fillColor=hc,strokeColor=hc,strokeWidth=1))
        d.add(String(x+BW/2,y+BH-9,name,fontSize=8,fontName='Helvetica-Bold',fillColor=WHITE,textAnchor='middle'))
        d.add(Rect(x,y,BW,BH-20,fillColor=WHITE,strokeColor=hc,strokeWidth=1))
        for i,f in enumerate(flds[name][:4]):
            fy=y+BH-30-i*12
            pfx='⬡ ' if i==0 else '• '
            d.add(String(x+5,fy,pfx+f,fontSize=6.5,fontName='Helvetica',fillColor=BLACK))
    cx=lambda n:positions[n][0]+BW/2
    cy=lambda n:positions[n][1]+BH/2
    rels=[
        ('User','Show','creates'),('User','Payment','1:N'),
        ('User','Comment','1:N'),('User','BugReport','1:N'),
        ('User','Organizer','1:1'),('Show','Genre','N:1'),
        ('Show','Ticket','1:N'),('Show','Theatre','N:M'),
        ('Ticket','Payment','1:1'),('Theatre','Ticket','1:N'),
        ('Show','Rating','1:N'),('Show','Comment','1:N'),
        ('Show','Cast','N:M'),('Show','Language','N:M'),
    ]
    for e1,e2,label in rels:
        x1,y1=cx(e1),cy(e1); x2,y2=cx(e2),cy(e2)
        d.add(Line(x1,y1,x2,y2,strokeColor=LGREY,strokeWidth=0.8))
        mx,my=(x1+x2)/2,(y1+y2)/2
        d.add(Rect(mx-14,my-5,28,11,rx=2,ry=2,fillColor=LGOLD,strokeColor=ORANGE,strokeWidth=0.5))
        d.add(String(mx,my+2,label,fontSize=6,fontName='Helvetica-Bold',fillColor=ORANGE,textAnchor='middle'))
    return d

# ── Flowable wrapper ─────────────────────────────────────────
class DF(Flowable):
    def __init__(self,drawing):
        super().__init__(); self.drawing=drawing; self.hAlign='CENTER'
    def wrap(self,*a): return self.drawing.width,self.drawing.height
    def draw(self): renderPDF.draw(self.drawing,self.canv,0,0)

# ═══════════════════════════════════════════════════
# BUILD PDF
# ═══════════════════════════════════════════════════
doc=SimpleDocTemplate('D:/movie/faizansynopsis_new.pdf',pagesize=A4,
    leftMargin=CONTENT_M,rightMargin=CONTENT_M,topMargin=CONTENT_M,bottomMargin=CONTENT_M)
s=[]

# ── PAGE 1: COVER ─────────────────────────────────
s+=[Spacer(1,.5*inch),
    Paragraph("M. C. E Society's",T1),
    Paragraph('Allana Institute of Management Sciences, Pune',T1),
    Spacer(1,.3*inch),
    Paragraph('Synopsis',T2), Paragraph('on',T3),
    Spacer(1,.4*inch),
    Paragraph('Cine Circuit',PT),
    Paragraph('Online Movie Ticket Booking System',T2),
    Spacer(1,.2*inch), Paragraph('Mini Project',T2),
    Spacer(1,.8*inch), Paragraph('By',T3),
    Paragraph('[Your Name]',T2),
    Spacer(1,.5*inch),
    Paragraph('[Course & Year]',T3),
    Paragraph('Roll No. [Your Roll No.]',T3),
    Spacer(1,.5*inch),
    Paragraph('Academic Year 2025-26',T2),
    Spacer(1,.3*inch),
    Paragraph('Guide Name',T3),
    Paragraph("[Your Guide's Name]",T3),
    PageBreak()]

# ── PAGE 2: ABSTRACT ──────────────────────────────
s+=[Spacer(1,.3*inch), Paragraph('ABSTRACT',SH), Spacer(1,.2*inch),
    Paragraph(
        'The <b>Cine Circuit</b> is a production-grade, full-stack web-based Online Movie '
        'Ticket Booking System designed to provide a seamless platform for users to browse '
        'movies, view showtimes, select seats, and book tickets online. The system serves four '
        'distinct user roles — <b>Viewers</b> (general users), <b>Organizers</b> (movie creators), '
        '<b>Theatrers</b> (theatre owners), and <b>Administrators</b> — each with dedicated '
        'dashboards and role-specific functionalities.',BD),
    Paragraph(
        'The platform eliminates physical box-office queues by enabling online seat selection '
        'and payment through an integrated <b>Razorpay</b> payment gateway. Secure authentication '
        'uses JWT in httpOnly cookies and bcrypt password hashing. Automated HTML email '
        'notifications are sent for OTP verification, booking confirmation, cancellations, '
        'password resets, organizer approvals, and maintenance alerts — 17 distinct email '
        'templates in total.',BD),
    Paragraph(
        'Cine Circuit is built with <b>React.js 19 (Vite)</b> and <b>Tailwind CSS</b> on the '
        'frontend, <b>Node.js + Express.js</b> on the backend, and <b>MongoDB Atlas</b> as the '
        'cloud database. Media is managed via <b>Cloudinary</b>, and the app is deployed on '
        '<b>Vercel</b> (frontend) and <b>Render</b> (backend). Advanced capabilities include '
        'an AI-powered movie recommendation engine, maintenance mode with user notifications, '
        'bug reporting with media attachments, SEO optimization with JSON-LD schemas, '
        'Progressive Web App (PWA) support, automated cron jobs for movie status updates, '
        'visitor tracking, Swagger API documentation, and a comprehensive analytics dashboard.',BD),
    PageBreak()]

# ── PAGE 3: INTRODUCTION + OBJECTIVES ───────────────
s+=[Spacer(1,.2*inch), Paragraph('Introduction',SH),
    Paragraph(
        'Cine Circuit is a comprehensive full-stack web application that automates and '
        'digitizes the movie ticket booking process. Traditional systems require physical '
        'visits to a box office, which is time-consuming and inconvenient. Cine Circuit '
        'solves this by providing an intuitive platform where users can register, browse '
        'movies, select seats interactively, make payments, and receive tickets — all online.',BD),
    Paragraph(
        'The system supports four roles: Viewers browse and book tickets; Organizers create '
        'and manage shows, upload posters/trailers, manage cast and hashtags, and submit '
        'verification documents; Theatrers manage venue details, allotted shows, ticket '
        'distribution, and sales analytics; Administrators oversee the entire platform — '
        'verifying shows/organizers/theatres, managing genres and languages, viewing analytics, '
        'and controlling maintenance mode.',BD),
    Spacer(1,.1*inch),
    Paragraph('Objectives of the Project',SbH),
    Paragraph(
        'The primary objective is to design and develop a <b>full-stack, production-grade '
        'Online Movie Ticket Booking System</b> that covers the entire lifecycle from movie '
        'creation and show scheduling to seat selection, payment, ticket delivery, and '
        'post-show reviews.',BD),
    Paragraph('Specific Objectives:',SbH),
    nlist([
        'Provide a multi-role online platform (Viewer, Organizer, Theatrer, Admin) with JWT-based secure authentication.',
        'Enable OTP-based email verification, password reset, and rate-limited profile updates (30-day cooldowns).',
        'Integrate Razorpay payment gateway with atomic seat locking to prevent double-booking race conditions.',
        'Allow Organizers to create shows with posters, trailers, cast, hashtags, genre, language, and ticket categories.',
        'Allow Theatrers to manage allotted shows, distribute tickets, view sales analytics, and update show timings.',
        'Provide Admins with full platform control: verify shows/organizers/theatres, manage genres/languages, and view dashboards.',
        'Deliver 17 automated HTML email notifications covering all major platform events.',
        'Implement an AI-powered movie recommendation engine using genre and sub-genre preferences.',
        'Support SEO with react-helmet-async, JSON-LD schemas, dynamic sitemap.xml, and robots.txt.',
        'Provide PWA support, visitor tracking, Swagger API docs, and automated cron jobs for movie status updates.',
    ]),
    PageBreak()]

# ── PAGE 4: MODULES ───────────────────────────────
s+=[Spacer(1,.2*inch), Paragraph('Modules',SH)]
mods=[
    ('Module 1: User Authentication & Account Management',
     'Handles registration, OTP email verification, login, logout, password reset, and '
     'profile updates (picture, username, phone, password) with rate-limiting cooldowns '
     'for all four user roles.'),
    ('Module 2: Movie & Show Management',
     'Organizers create shows with full metadata — title, tagline, genre, sub-genre, '
     'language, release date, cast, director, producer, writers, budget, poster, trailer, '
     'and hashtags. Show status is auto-managed (Upcoming → Released → Expired) by cron jobs.'),
    ('Module 3: Ticket Booking & Seat Selection',
     'Viewers browse shows, pick a theatre and date, select ticket count per category '
     '(Standard/Premium/VIP/Family/Loyalty), and proceed to checkout with live availability checks.'),
    ('Module 4: Payment & Order Processing',
     'Razorpay order creation with a pre-payment DB check, atomic findOneAndUpdate on '
     'verification, QR-code ticket generation, email confirmation, and cancellation '
     'with seat release.'),
    ('Module 5: Theatre Management',
     'Theatrers register their venue, get admin approval, receive show allotments, '
     'distribute tickets to buyers, view per-show revenue, and update show timings — '
     'with email notifications to affected ticket holders.'),
    ('Module 6: Organizer Verification & Profiles',
     'Organizers submit comprehensive professional profiles (role, experience, projects, '
     'awards, social media) and role-specific forms (Director/Producer × Fresher/Experienced). '
     'Admin reviews with approval/rejection and up to 3 attempts before lockout.'),
    ('Module 7: Admin Dashboard & Control Panel',
     'Admins manage users, verify organizers/theatres/shows, perform CRUD on genres, '
     'sub-genres and languages, delete comments, view analytics charts, toggle maintenance '
     'mode, and handle bug reports.'),
    ('Module 8: AI Movie Recommendation Engine',
     'A public genre-based recommendation system: user selects genre → sub-genres shown → '
     'user selects sub-genre → top-8 most-liked matching movies returned.'),
    ('Module 9: Email Notification System',
     '17 HTML email templates auto-sent for: OTP, booking confirmation, payment failure, '
     'ticket PDF, password reset, profile updates (name/phone/image/password), '
     'organizer approval/rejection, theatre approval/rejection, maintenance alert, '
     'bug report submission/resolution.'),
    ('Module 10: Bug Reporting System',
     'Logged-in users submit bug reports (title, description, up to 5 images + 2 videos). '
     'Auto-generates a unique BUG-XXXXXX ID. Admins filter by status, update with notes, '
     'and trigger resolution emails.'),
    ('Module 11: Rating, Review & Engagement',
     'Viewers post star ratings (1-5) and text reviews (purchase required), post/delete '
     'comments (max 500 chars), like/dislike movies, add to wishlist, and receive a '
     'review-prompt popup 3 hours after a show ends.'),
    ('Module 12: SEO, PWA & Performance',
     'React Helmet meta tags + JSON-LD Movie schema per movie page, dynamic sitemap.xml '
     'endpoint, robots.txt, PWA manifest + service worker, lazy-loaded routes, cookie '
     'consent banner, visitor tracking, and mobile-blocker for screens < 768px.'),
]
for title,desc in mods:
    s+=[Paragraph(title,SbH), Paragraph(desc,BD)]
s.append(PageBreak())

# ── PAGE 5: SCOPE ─────────────────────────────────
s+=[Spacer(1,.2*inch), Paragraph('Scope and Functionality of Each Module',SH)]

s.append(Paragraph('Authentication & Account Management',SbH))
s.append(blist([
    'OTP auto-expires in 2 minutes; resend cooldown enforced',
    'JWT stored in httpOnly cookie; bcrypt password hashing (10 salt rounds)',
    'Role-based access: Viewer / Organizer / Theatrer / Administrator',
    'Update cooldowns: profile image & username & password (30 days), phone (7 days)',
    'Last login timestamp array tracked per user',
]))
s.append(Paragraph('Movie & Show Management',SbH))
s.append(blist([
    'Show metadata: title, tagline, genre, sub-genre, language, cast, hashtags, budget',
    'Poster (max 100MB) and trailer upload to Cloudinary',
    'Cron job runs every 6 hours: Upcoming → Released → Expired auto-transition',
    'Admin verification gate before show goes live on platform',
    'Custom messages per show for announcements',
]))
s.append(Paragraph('Ticket Booking & Payment',SbH))
s.append(blist([
    'Ticket categories: Standard, Premium, VIP, Family, Loyalty',
    'Fresh DB re-check before Razorpay order creation (prevents overselling)',
    'Atomic findOneAndUpdate on payment verification (prevents race conditions)',
    'QR code embedded in ticket; PDF generated and emailed to user',
    'Cancellation workflow: seat released, refund initiated, email sent',
]))
s.append(Paragraph('Theatre & Organizer Management',SbH))
s.append(blist([
    'Theatre registration → Admin approval (Pending/Approved/Rejected workflow)',
    'Show allotment system: Organizer allots theatre → Theatre sees it in dashboard',
    'Organizer profile: up to 3 verification attempts; lockout after 3 failures',
    'Director/Producer × Fresher/Experienced sub-forms with word-limited fields',
    'Theatre sales analytics: revenue per show, payment status, unsold tickets',
]))
s.append(Paragraph('Admin Panel & Bug Reports',SbH))
s.append(blist([
    'CRUD operations on Genre, Sub-Genre, Language',
    'User lists: verified/unverified users, organizers, and theatres',
    'Analytics dashboard with booking and revenue charts',
    'Maintenance mode: custom message, end time, optional mass email to all users',
    'Bug reports: paginated list, status filter, media preview, admin notes',
]))
s.append(PageBreak())

# ── PAGE 6: TECHNOLOGY USED ───────────────────────
s+=[Spacer(1,.2*inch), Paragraph('Technology Used',SH),
    Paragraph(
        'A <b>System Requirement Specification (SRS)</b> outlines the essential hardware '
        'and software requirements for the development, deployment, and operation of Cine '
        'Circuit.',BD),
    Paragraph('Hardware Requirements',SbH),
    blist([
        'Processor: Intel Core i3 / AMD Ryzen 3 or above',
        'RAM: Minimum 8 GB',
        'Storage: Minimum 100 GB (SSD preferred)',
        'Internet Connection: Required (cloud-based system)',
    ]),
    Spacer(1,.1*inch),
    Paragraph('Software Requirements',SbH),
    blist([
        'Operating System: Windows 10/11 or Linux (Ubuntu)',
        'Runtime: Node.js v20.x',
        'Frontend: React.js v19 + Vite 6 + Tailwind CSS v4 + Redux Toolkit',
        'Backend: Node.js + Express.js v4',
        'Database: MongoDB (MongoDB Atlas cloud) via Mongoose v8',
        'Authentication: JSON Web Tokens (JWT) + bcrypt (httpOnly cookies)',
        'Payment: Razorpay SDK',
        'Media Storage: Cloudinary (images, videos, PDFs)',
        'Email: Nodemailer (SMTP)',
        'File Upload: express-fileupload (10MB images / 100MB video)',
        'Rate Limiting: express-rate-limit (5 auth attempts / 200 general per 15 min)',
        'Scheduled Jobs: node-cron (every 6 hours for movie status updates)',
        'Visitor Tracking: express-visitor-counter',
        'API Documentation: Swagger UI (swagger-jsdoc + swagger-ui-express)',
        'SEO: react-helmet-async + JSON-LD + dynamic sitemap.xml',
        'PWA: Web App Manifest + Service Worker',
        'Animations: GSAP + Swiper.js',
        'Forms: React Hook Form',
        'Deployment: Vercel (frontend) + Render (backend)',
        'Version Control: Git + GitHub',
        'Browser: Google Chrome / Mozilla Firefox',
    ]),
    PageBreak()]

# ── PAGE 7: USE CASE DIAGRAM ─────────────────────
s+=[Spacer(1,.1*inch), Paragraph('System Diagrams',SH),
    Paragraph('Use Case Diagram',SbH),
    DF(make_usecase()),
    Paragraph('Figure 1: Use Case Diagram — Cine Circuit (4 Actors)',CAP),
    PageBreak()]

# ── PAGE 8: ACTIVITY DIAGRAM ─────────────────────
s+=[Spacer(1,.1*inch),
    Paragraph('Activity Diagram — Ticket Booking Flow',SbH),
    DF(make_activity()),
    Paragraph('Figure 2: Activity Diagram — Full Ticket Booking & Cancellation Process',CAP),
    PageBreak()]

# ── PAGE 9: SEQUENCE DIAGRAM ─────────────────────
s+=[Spacer(1,.1*inch),
    Paragraph('Sequence Diagram — Booking Interaction',SbH),
    DF(make_sequence()),
    Paragraph('Figure 3: Sequence Diagram — User → Browser → Backend → MongoDB → Razorpay',CAP),
    PageBreak()]

# ── PAGE 10: ER DIAGRAM ───────────────────────────
s+=[Spacer(1,.1*inch),
    Paragraph('Database / ER Diagram',SbH),
    DF(make_er()),
    Paragraph('Figure 4: ER Diagram — 16 MongoDB Collections with Relationships',CAP),
    PageBreak()]

# ── PAGE 11: LIMITATIONS + CONCLUSION ───────────
s+=[Spacer(1,.2*inch),
    Paragraph('Limitations of the Proposed System',SbH),
    nlist([
        'No native mobile app (web-based only; PWA partial offline support included).',
        'Seat selection is count-based, not individual interactive seat map.',
        'AI recommendation uses genre-based filtering only, not collaborative filtering.',
        'Seat availability uses DB-level atomic operations, not WebSocket real-time sync.',
        'Refund initiation is manual; automatic bank refund not implemented.',
        'JWT stored in localStorage on client side (XSS risk — BUG-2 noted for future fix).',
        'UI is English-only; no multi-language interface support.',
        'Chat module is a placeholder; real-time messaging not yet implemented.',
    ]),
    Spacer(1,.3*inch),
    Paragraph('Conclusion',SH),
    Paragraph(
        'Cine Circuit successfully demonstrates the design and development of a full-stack, '
        'production-grade Online Movie Ticket Booking System. By integrating modern technologies '
        '— React.js, Node.js, MongoDB Atlas, Razorpay, and Cloudinary — the project delivers '
        'a real-world applicable solution covering the complete lifecycle from movie creation '
        'to ticket delivery.',BD),
    Paragraph(
        'The platform supports four user roles, 79 REST API endpoints, 26 database models, '
        '17 automated email templates, and 12 major feature modules. Advanced features like '
        'AI movie recommendations, automated cron jobs, maintenance mode, SEO with JSON-LD '
        'schemas, PWA support, visitor tracking, and a Swagger-documented API make Cine '
        'Circuit a comprehensive, scalable, and production-ready system.',BD),
    Paragraph(
        'This project provided valuable hands-on experience in full-stack web development, '
        'RESTful API design, database modeling with MongoDB, cloud deployment, secure '
        'authentication, payment gateway integration, and software engineering best practices '
        '— reflecting practical implementation of academic concepts and readiness for '
        'industry-level development.',BD),
    Spacer(1,.5*inch),
    Paragraph('Student Name           :  [Your Full Name]',BD),
    Paragraph('Student Mobile Number  :  [Your Mobile Number]',BD),
    Paragraph('E-mail Id              :  [Your Email Address]',BD),
    Paragraph('Permanent Address      :  [Your Permanent Address]',BD),
]

doc.build(s, canvasmaker=BorderCanvas)
print("PDF generated: D:/movie/faizansynopsis_new.pdf")
