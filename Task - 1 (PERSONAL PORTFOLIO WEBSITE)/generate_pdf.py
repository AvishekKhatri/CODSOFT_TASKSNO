from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.units import inch

def generate_resume():
    doc = SimpleDocTemplate("Avishek_Khatri_Resume.pdf", pagesize=A4, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)
    styles = getSampleStyleSheet()
    
    # Custom Styles
    title_style = ParagraphStyle(
        name='TitleStyle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor("#2c3e50"),
        spaceAfter=10
    )
    
    heading_style = ParagraphStyle(
        name='HeadingStyle',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor("#34495e"),
        spaceBefore=12,
        spaceAfter=6,
        fontName="Helvetica-Bold"
    )
    
    normal_style = ParagraphStyle(
        name='NormalStyle',
        parent=styles['Normal'],
        fontSize=10,
        spaceAfter=6,
        leading=14
    )
    
    bullet_style = ParagraphStyle(
        name='BulletStyle',
        parent=styles['Normal'],
        fontSize=10,
        leftIndent=15,
        spaceAfter=3,
        leading=14
    )

    story = []
    
    # Header Section
    story.append(Paragraph("<b>Avishek Khatri</b>", title_style))
    contact_info = (
        "<b>Passport:</b> PA0103988 | <b>Date of birth:</b> 04/11/2003 | <b>Place of birth:</b> Sinja - 2, Jumla, Nepal<br/>"
        "<b>Nationality:</b> Nepalese | <b>Gender:</b> Male | <b>Phone number:</b> (+977) 9866296588<br/>"
        "<b>Email:</b> avishekkhatri2@gmail.com | <b>Website:</b> https://github.com/AvishekKhatri<br/>"
        "<b>Instagram:</b> https://www.instagram.com/i_am_avishek_khatri/ | <b>Whatsapp:</b> +977 9866296588<br/>"
        "<b>Address:</b> Sinja - 2, 21207, Jumla, Nepal (Home)"
    )
    story.append(Paragraph(contact_info, normal_style))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.black, spaceAfter=15))

    # ABOUT ME
    story.append(Paragraph("ABOUT ME", heading_style))
    about_text = (
        "Versatile Computer Science graduate with a strong record of delivering clean, well-tested, production-ready solutions "
        "in both independent and collaborative environments. Committed to continuous learning, innovation, and contributing to "
        "impactful engineering projects."
    )
    story.append(Paragraph(about_text, normal_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.grey, spaceAfter=10, spaceBefore=10))

    # EDUCATION AND TRAINING
    story.append(Paragraph("EDUCATION AND TRAINING", heading_style))
    story.append(Paragraph("<b>2021 - 2025 | Kollam, India</b>", normal_style))
    story.append(Paragraph("<b>B. TECH IN COMPUTER SCIENCE AND ENGINEERING</b> - Amrita Vishwa Vidyapeetham", normal_style))
    story.append(Paragraph("Website: http://amrita.edu/campus/amritapuri/ | Field of study: Information and Communication Technologies", normal_style))
    story.append(Paragraph("Final grade: CGPA 6.49/10 | Level in EQF: EQF level 6", normal_style))
    story.append(Spacer(1, 5))
    
    story.append(Paragraph("<b>2019 - 2021 | Kathmandu, Nepal</b>", normal_style))
    story.append(Paragraph("<b>HIGHER SECONDARY SCHOOL</b> - Capital College and Research Center (CCRC)", normal_style))
    story.append(Paragraph("Website: https://ccrc.edu.np/ | Final grade: GPA 3.01/4", normal_style))
    story.append(Spacer(1, 5))

    story.append(Paragraph("<b>2015 - 2019 | Rolpa, Nepal</b>", normal_style))
    story.append(Paragraph("<b>SECONDARY EDUCATION EXAMINATION</b> - Gyan Mandir Vidhya Griha Khungri", normal_style))
    story.append(Paragraph("Final grade: GPA 3.05/4", normal_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.grey, spaceAfter=10, spaceBefore=10))

    # TECHNICAL SKILLS
    story.append(Paragraph("TECHNICAL SKILLS", heading_style))
    story.append(Paragraph("<b>Languages:</b> Python, C/C++, Java, SQL, JavaScript, Haskell, Embedded C, HTML", normal_style))
    story.append(Paragraph("<b>Frameworks &amp; Libraries:</b> React.js, Spring Boot, Node.js, PeerJS, WebRTC", normal_style))
    story.append(Paragraph("<b>Tools &amp; Technologies:</b> Git, GitHub, Maven, Docker, Kafka, Firebase, Power BI, REST APIs", normal_style))
    story.append(Paragraph("<b>Databases:</b> MySQL, H2, Firebase Firestore", normal_style))
    story.append(Paragraph("<b>Concepts:</b> OOP, Microservices, IAM, Data Analysis, Machine Learning Basics, Agile", normal_style))
    
    # SOFT SKILLS
    story.append(Paragraph("SOFT SKILLS", heading_style))
    story.append(Paragraph("Microsoft Office, Communication and Leadership Skill, Coordination and Collaboration Skills", normal_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.grey, spaceAfter=10, spaceBefore=10))

    # PROJECTS
    story.append(Paragraph("PROJECTS", heading_style))
    story.append(Paragraph("<b>30/11/2021 | Flight Management System</b>", normal_style))
    story.append(Paragraph("• Developed a comprehensive flight management system using Java and SQL, facilitating flight bookings with customizable options such as seat selection, meals, etc.", bullet_style))
    story.append(Paragraph("• Utilized SQL for database management to store flight information, user data, bookings, and admin operations.", bullet_style))
    story.append(Paragraph("• Designed an intuitive admin dashboard for easy management of flight schedules, seat availability, and other relevant details.", bullet_style))
    story.append(Spacer(1, 5))
    
    story.append(Paragraph("<b>30/11/2024 | Strangers Connection</b>", normal_style))
    story.append(Paragraph("• This is a mobile application designed for anonymous communication with strangers, providing video calling functionality through PeerJS and WebRTC, along with user authentication, a points system, and Firebase integration for backend services.", bullet_style))
    story.append(Paragraph("• This application targets Android users seeking random communication, with potential future scalability to iOS and other platforms.", bullet_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.grey, spaceAfter=10, spaceBefore=10))

    # VIRTUAL EXPERIENCE
    story.append(Paragraph("VIRTUAL EXPERIENCE", heading_style))
    story.append(Paragraph("<b>30/12/2025 | Tata Cybersecurity Analyst Job Simulation</b>", normal_style))
    story.append(Paragraph("• Completed a job simulation involving Identity and Access Management (IAM) for Tata Consultancy Services, collaborating with a cybersecurity consulting team.", bullet_style))
    story.append(Paragraph("• Acquired expertise in IAM principles, cybersecurity best practices, and strategic alignment with business objectives.", bullet_style))
    story.append(Paragraph("• Delivered documentation and presentations demonstrating the ability to communicate cybersecurity concepts and IAM strategies effectively.", bullet_style))
    story.append(Spacer(1, 5))

    story.append(Paragraph("<b>07/05/2026 | JPMorganChase Software Engineering Job Simulation (Forage)</b>", normal_style))
    story.append(Paragraph("• Integrated Kafka into a Spring Boot microservice to process high-volume transaction messages using embedded Kafka testing frameworks.", bullet_style))
    story.append(Paragraph("• Implemented transaction validation and persistence logic using Spring Data JPA and H2 database integration.", bullet_style))
    story.append(Paragraph("• Connected the application with external REST APIs and developed REST endpoints for balance retrieval and transaction workflows.", bullet_style))
    story.append(Paragraph("• Tested and validated system reliability using Maven test suites and debugger-driven inspections across APIs and database operations.", bullet_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.grey, spaceAfter=10, spaceBefore=10))

    # HONOURS AND AWARDS
    story.append(Paragraph("HONOURS AND AWARDS", heading_style))
    story.append(Paragraph("<b>11/2021 | COMPEX-2021 Scholarship Scheme for Undergraduate Courses – Embassy of India</b>", normal_style))
    story.append(Paragraph("Full Ride Scholarship to pursue B.Tech in Computer Science at Amrita Vishwa Vidyapeetham by the Indian Embassy, Kathmandu, Nepal.", normal_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.grey, spaceAfter=10, spaceBefore=10))

    # CERTIFICATIONS
    story.append(Paragraph("CERTIFICATIONS", heading_style))
    certs = [
        "<b>Simplilearn, 01/2024:</b> Excel Automation using ChatGPT",
        "<b>Coursera, 01/2024:</b> Investment Risk Management",
        "<b>Udemy, 03/2024:</b> Artificial Intelligence A-Z 2024: Build 7 AI + LLM & ChatGPT",
        "<b>SkillEcted, 10/2025:</b> EDA Analysis & Visualization of Retail using Power BI",
        "<b>Anthropic, 04/05/2026:</b> Claude AI Fluency & Building with Claude",
        "<b>Cisco Networking Academy, 05/05/2026:</b> Introduction to Data Science"
    ]
    for cert in certs:
        story.append(Paragraph(cert, normal_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.grey, spaceAfter=10, spaceBefore=10))

    # COMMUNITY OUTREACH
    story.append(Paragraph("COMMUNITY OUTREACH", heading_style))
    story.append(Paragraph("<b>2022 | Student Social Responsibility (SSR)</b>", normal_style))
    story.append(Paragraph("• Conducted surveys among tourists to identify and address any issues or challenges they faced during their visits, aiming to improve the overall tourism experience and promote sustainable tourism practices.", bullet_style))
    story.append(Paragraph("• Engaged in student social responsibility activities, organizing awareness campaigns within local communities to educate them about tourism and its significance.", bullet_style))

    # Build PDF
    doc.build(story)
    print("PDF generated successfully.")

if __name__ == "__main__":
    generate_resume()
