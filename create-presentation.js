const pptxgen = require("pptxgenjs");

let pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Velvora Team";
pres.title = "E-commerce Website for Clothing Business";

// Color palette
const P = "1A365D";      // Primary
const S = "2C5282";      // Secondary
const A = "E53E3E";      // Accent
const L = "EBF8FF";      // Light
const W = "FFFFFF";      // White
const B = "1A202C";      // Black
const G = "718096";      // Gray
const LG = "E2E8F0";    // Light Gray

// Helper: create shadow
const shadow = () => ({ type: "outer", color: "000000", blur: 4, offset: 2, angle: 135, opacity: 0.2 });

// ============ SLIDE 1: TITLE ============
let slide1 = pres.addSlide();
slide1.background = { color: P };
slide1.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: S } });
slide1.addText("E-Commerce Website for\nClothing Business", {
  x: 0.5, y: 1.8, w: 9, h: 1.5,
  fontSize: 40, fontFace: "Times New Roman",
  color: W, bold: true, align: "center", valign: "middle"
});
slide1.addText("Velvora Luxury - Database Management System Project", {
  x: 0.5, y: 3.5, w: 9, h: 0.8,
  fontSize: 24, fontFace: "Times New Roman",
  color: L, align: "center"
});
slide1.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.2, w: 10, h: 0.425, fill: { color: A } });

// ============ SLIDE 2: TABLE OF CONTENTS ============
let slide2 = pres.addSlide();
slide2.background = { color: W };
slide2.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: P } });
slide2.addText("Table of Contents", { x: 0.5, y: 0.15, w: 9, h: 0.6, fontSize: 28, fontFace: "Times New Roman", color: W, bold: true });
slide2.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.9, w: 10, h: 0.05, fill: { color: A } });

const tocItems = [
  "1. Abstract", "2. Introduction", "3. Need for the Study", "4. Objectives",
  "5. Literature Survey", "6. Methodology Used to Achieve Objectives",
  "7. Software Requirements", "8. Execution Screenshots", "9. Code in Separate File",
  "10. Creativity and Innovation", "11. Future Scope", "12. Conclusion"
];
slide2.addText(tocItems.join("\n"), { x: 1, y: 1.2, w: 8, h: 4, fontSize: 18, fontFace: "Times New Roman", color: B, valign: "top" });

// ============ SLIDE 3: ABSTRACT ============
let slide3 = pres.addSlide();
slide3.background = { color: W };
slide3.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: P } });
slide3.addText("Abstract", { x: 0.5, y: 0.15, w: 9, h: 0.6, fontSize: 28, fontFace: "Times New Roman", color: W, bold: true });
slide3.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.9, w: 10, h: 0.05, fill: { color: A } });

slide3.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 1.1, w: 9, h: 4.3, fill: { color: L }, line: { color: S, width: 1 }, rectRadius: 0.1, shadow: shadow() });
slide3.addText("This project presents the design and development of \"Velvora Luxury\", a comprehensive e-commerce platform specifically tailored for clothing business operations. The system leverages modern web technologies including Node.js for backend processing, Express.js for API management, and PostgreSQL (Supabase) for robust data storage and management.\n\nThe platform encompasses complete online shopping functionality including user registration and authentication, product catalog browsing with category-based filtering, shopping cart management, secure payment processing through PayU integration, and a comprehensive admin dashboard for inventory and order management.\n\nKey features include real-time stock management, multi-size and multi-color product variants, responsive design for mobile and desktop platforms, automated email notifications for order confirmations, and seamless checkout experience. The database schema is designed to maintain data integrity while supporting efficient query operations for customer analytics and business intelligence.", {
  x: 0.7, y: 1.2, w: 8.6, h: 4.1, fontSize: 16, fontFace: "Times New Roman", color: B, valign: "top"
});

// ============ SLIDE 4: INTRODUCTION ============
let slide4 = pres.addSlide();
slide4.background = { color: W };
slide4.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: P } });
slide4.addText("Introduction", { x: 0.5, y: 0.15, w: 9, h: 0.6, fontSize: 28, fontFace: "Times New Roman", color: W, bold: true });
slide4.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.9, w: 10, h: 0.05, fill: { color: A } });

// Left box
slide4.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 1.1, w: 4.3, h: 4.3, fill: { color: L }, line: { color: S, width: 1 }, rectRadius: 0.1, shadow: shadow() });
slide4.addText("About Velvora", { x: 0.7, y: 1.2, w: 3.9, h: 0.5, fontSize: 20, fontFace: "Times New Roman", color: P, bold: true });
slide4.addText("Velvora Luxury is a premium e-commerce solution designed for fashion retailers seeking to establish a compelling online presence. The platform embodies sophistication and elegance while delivering seamless shopping experiences.\n\nBuilt with scalability in mind, the system supports growing inventory catalogs and increasing transaction volumes without compromising performance.", { x: 0.7, y: 1.8, w: 3.9, h: 3.4, fontSize: 16, fontFace: "Times New Roman", color: B, valign: "top" });

// Right box
slide4.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 5.2, y: 1.1, w: 4.3, h: 4.3, fill: { color: L }, line: { color: S, width: 1 }, rectRadius: 0.1, shadow: shadow() });
slide4.addText("Project Scope", { x: 5.4, y: 1.2, w: 3.9, h: 0.5, fontSize: 20, fontFace: "Times New Roman", color: P, bold: true });
slide4.addText("The project encompasses the development of a full-stack e-commerce application with the following core modules:\n\n• Customer-facing storefront\n• User authentication system\n• Product management catalog\n• Shopping cart functionality\n• Payment gateway integration\n• Order processing workflow\n• Admin dashboard\n• Email notification system\n• Database management layer", { x: 5.4, y: 1.8, w: 3.9, h: 3.4, fontSize: 16, fontFace: "Times New Roman", color: B, valign: "top" });

// ============ SLIDE 5: NEED FOR THE STUDY ============
let slide5 = pres.addSlide();
slide5.background = { color: W };
slide5.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: P } });
slide5.addText("Need for the Study", { x: 0.5, y: 0.15, w: 9, h: 0.6, fontSize: 28, fontFace: "Times New Roman", color: W, bold: true });
slide5.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.9, w: 10, h: 0.05, fill: { color: A } });

const needs = [
  { title: "Business Perspective", content: "Traditional brick-and-mortar clothing stores face increasing operational costs and limited market reach. An online presence has become essential for business survival and growth in the competitive retail landscape." },
  { title: "Customer Expectations", content: "Modern consumers expect convenient 24/7 shopping access, detailed product information, multiple payment options, and real-time order tracking capabilities that only digital platforms can provide." },
  { title: "Technical Requirements", content: "Effective e-commerce operations require robust database systems capable of managing complex product attributes, customer data, transaction records, and inventory levels with high reliability." }
];

needs.forEach((n, i) => {
  const y = 1.1 + i * 1.45;
  slide5.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: y, w: 9, h: 1.35, fill: { color: L }, line: { color: S, width: 1 }, rectRadius: 0.1, shadow: shadow() });
  slide5.addText(n.title, { x: 0.7, y: y + 0.1, w: 8.6, h: 0.4, fontSize: 18, fontFace: "Times New Roman", color: P, bold: true });
  slide5.addText(n.content, { x: 0.7, y: y + 0.55, w: 8.6, h: 0.7, fontSize: 14, fontFace: "Times New Roman", color: B });
});

// ============ SLIDE 6: OBJECTIVES ============
let slide6 = pres.addSlide();
slide6.background = { color: W };
slide6.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: P } });
slide6.addText("Objectives", { x: 0.5, y: 0.15, w: 9, h: 0.6, fontSize: 28, fontFace: "Times New Roman", color: W, bold: true });
slide6.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.9, w: 10, h: 0.05, fill: { color: A } });

const objectives = [
  { num: "01", title: "Develop User Registration System", desc: "Create secure customer account creation with email verification and password encryption" },
  { num: "02", title: "Implement Product Catalog", desc: "Build comprehensive product database with categories, variants, pricing, and inventory tracking" },
  { num: "03", title: "Design Shopping Cart", desc: "Enable customers to add, modify, and manage items before checkout with persistent cart state" },
  { num: "04", title: "Integrate Payment Gateway", desc: "Connect PayU payment processing for secure online transactions" },
  { num: "05", title: "Create Admin Dashboard", desc: "Develop administrative interface for inventory, orders, and customer management" },
  { num: "06", title: "Establish Database Management", desc: "Implement PostgreSQL database with proper schema, relationships, and query optimization" }
];

objectives.forEach((obj, i) => {
  const row = Math.floor(i / 2);
  const col = i % 2;
  const x = 0.5 + col * 4.7;
  const y = 1.1 + row * 1.45;
  
  slide6.addShape(pres.shapes.OVAL, { x: x, y: y + 0.1, w: 0.5, h: 0.5, fill: { color: A } });
  slide6.addText(obj.num, { x: x, y: y + 0.1, w: 0.5, h: 0.5, fontSize: 14, fontFace: "Times New Roman", color: W, bold: true, align: "center", valign: "middle" });
  slide6.addText(obj.title, { x: x + 0.6, y: y, w: 4, h: 0.4, fontSize: 16, fontFace: "Times New Roman", color: P, bold: true });
  slide6.addText(obj.desc, { x: x + 0.6, y: y + 0.4, w: 4, h: 0.9, fontSize: 12, fontFace: "Times New Roman", color: G });
});

// ============ SLIDE 7: LITERATURE SURVEY ============
let slide7 = pres.addSlide();
slide7.background = { color: W };
slide7.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: P } });
slide7.addText("Literature Survey", { x: 0.5, y: 0.15, w: 9, h: 0.6, fontSize: 28, fontFace: "Times New Roman", color: W, bold: true });
slide7.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.9, w: 10, h: 0.05, fill: { color: A } });

// Four boxes in 2x2 grid
const litBoxes = [
  { title: "Backend Technologies", content: "• Node.js: Server-side JavaScript runtime\n• Express.js: Minimalist web framework\n• PostgreSQL: Advanced relational database", x: 0.5, y: 1.1 },
  { title: "Frontend Technologies", content: "• HTML5/CSS3: Standard markup\n• JavaScript (ES6+): Dynamic scripting\n• PWA: Service workers for offline", x: 5.2, y: 1.1 },
  { title: "Database Systems", content: "• Supabase: PostgreSQL BaaS\n• SQL.js: Client-side SQLite\n• Connection Pooling for scalability", x: 0.5, y: 3.3 },
  { title: "Payment Integration", content: "• PayU India: Secure gateway\n• PCI DSS Compliance\n• Multiple payment options", x: 5.2, y: 3.3 }
];

litBoxes.forEach(box => {
  slide7.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: box.x, y: box.y, w: 4.3, h: 2.1, fill: { color: L }, line: { color: S, width: 1 }, rectRadius: 0.1, shadow: shadow() });
  slide7.addText(box.title, { x: box.x + 0.15, y: box.y + 0.1, w: 4, h: 0.4, fontSize: 16, fontFace: "Times New Roman", color: P, bold: true });
  slide7.addText(box.content, { x: box.x + 0.15, y: box.y + 0.55, w: 4, h: 1.4, fontSize: 13, fontFace: "Times New Roman", color: B });
});

// ============ SLIDE 8: METHODOLOGY ============
let slide8 = pres.addSlide();
slide8.background = { color: W };
slide8.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: P } });
slide8.addText("Methodology Used to Achieve Objectives", { x: 0.5, y: 0.15, w: 9, h: 0.6, fontSize: 24, fontFace: "Times New Roman", color: W, bold: true });
slide8.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.9, w: 10, h: 0.05, fill: { color: A } });

const methods = [
  { phase: "Phase 1", title: "Requirements Analysis", tasks: "• Stakeholder interviews\n• System requirements\n• Use case diagrams\n• DB schema design" },
  { phase: "Phase 2", title: "Design", tasks: "• UI/UX wireframing\n• Database normalization\n• API specification\n• Security protocols" },
  { phase: "Phase 3", title: "Implementation", tasks: "• Frontend development\n• Backend API coding\n• Database setup\n• Payment integration" },
  { phase: "Phase 4", title: "Testing & Deployment", tasks: "• Unit testing\n• Integration testing\n• User acceptance\n• Production deploy" }
];

methods.forEach((m, i) => {
  const x = 0.5 + i * 2.35;
  slide8.addShape(pres.shapes.RECTANGLE, { x: x, y: 1.1, w: 2.25, h: 0.9, fill: { color: S } });
  slide8.addText(m.phase, { x: x, y: 1.1, w: 2.25, h: 0.45, fontSize: 14, fontFace: "Times New Roman", color: W, bold: true, align: "center", valign: "middle" });
  slide8.addText(m.title, { x: x, y: 1.55, w: 2.25, h: 0.4, fontSize: 11, fontFace: "Times New Roman", color: W, align: "center", valign: "middle" });
  slide8.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x, y: 2.05, w: 2.25, h: 1.6, fill: { color: L }, line: { color: S, width: 1 }, rectRadius: 0.05 });
  slide8.addText(m.tasks, { x: x + 0.1, y: 2.15, w: 2.05, h: 1.4, fontSize: 11, fontFace: "Times New Roman", color: B });
});

// Architecture flow
slide8.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 3.85, w: 9, h: 1.6, fill: { color: L }, line: { color: S, width: 1 }, rectRadius: 0.1 });
slide8.addText("System Architecture Flow", { x: 0.5, y: 3.9, w: 9, h: 0.4, fontSize: 16, fontFace: "Times New Roman", color: P, bold: true, align: "center" });

const flowItems = ["Client Browser", "Express Server", "PostgreSQL DB", "PayU Gateway", "Email Service"];
flowItems.forEach((item, i) => {
  const x = 0.8 + i * 1.8;
  slide8.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x, y: 4.4, w: 1.5, h: 0.6, fill: { color: i === 2 ? A : S }, rectRadius: 0.05 });
  slide8.addText(item, { x: x, y: 4.4, w: 1.5, h: 0.6, fontSize: 10, fontFace: "Times New Roman", color: W, bold: true, align: "center", valign: "middle" });
  if (i < flowItems.length - 1) {
    slide8.addText("→", { x: x + 1.5, y: 4.4, w: 0.3, h: 0.6, fontSize: 16, color: P, align: "center", valign: "middle" });
  }
});

// ============ SLIDE 9: SOFTWARE REQUIREMENTS ============
let slide9 = pres.addSlide();
slide9.background = { color: W };
slide9.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: P } });
slide9.addText("Software Requirements", { x: 0.5, y: 0.15, w: 9, h: 0.6, fontSize: 28, fontFace: "Times New Roman", color: W, bold: true });
slide9.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.9, w: 10, h: 0.05, fill: { color: A } });

// Table 1
slide9.addText("System Requirements", { x: 0.5, y: 1.05, w: 4.5, h: 0.4, fontSize: 18, fontFace: "Times New Roman", color: P, bold: true });
slide9.addTable([
  [{ text: "Component", options: { fill: { color: P }, color: W, bold: true, align: "center" } }, { text: "Specification", options: { fill: { color: P }, color: W, bold: true, align: "center" } }],
  ["Operating System", "Windows 10+ / Linux / macOS"],
  ["Processor", "Intel Core i3 or equivalent"],
  ["RAM", "Minimum 4GB (8GB recommended)"],
  ["Storage", "Minimum 256GB HDD/SSD"],
  ["Node.js", "Version 18.x or higher"],
  ["Database", "PostgreSQL / Supabase Cloud"]
], { x: 0.5, y: 1.45, w: 4.5, h: 2.4, border: { pt: 0.5, color: G }, fontFace: "Times New Roman", fontSize: 11, color: B, valign: "middle" });

// Table 2
slide9.addText("Development Tools", { x: 5.2, y: 1.05, w: 4.3, h: 0.4, fontSize: 18, fontFace: "Times New Roman", color: P, bold: true });
slide9.addTable([
  [{ text: "Category", options: { fill: { color: S }, color: W, bold: true, align: "center" } }, { text: "Technology", options: { fill: { color: S }, color: W, bold: true, align: "center" } }],
  ["Frontend", "HTML5, CSS3, JavaScript"],
  ["Backend", "Node.js, Express.js"],
  ["Database", "PostgreSQL (Supabase)"],
  ["Payments", "PayU Gateway API"],
  ["Email", "EmailJS Service"],
  ["Hosting", "Vercel / Local Server"]
], { x: 5.2, y: 1.45, w: 4.3, h: 2.4, border: { pt: 0.5, color: G }, fontFace: "Times New Roman", fontSize: 11, color: B, valign: "middle" });

// Packages box
slide9.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 4.0, w: 9, h: 1.4, fill: { color: L }, line: { color: S, width: 1 }, rectRadius: 0.1 });
slide9.addText("Required NPM Packages", { x: 0.7, y: 4.1, w: 8.6, h: 0.4, fontSize: 16, fontFace: "Times New Roman", color: P, bold: true });
slide9.addText("express • pg • cors • dotenv • @neondatabase/serverless • @vercel/postgres • sql.js • docx • bcryptjs • jsonwebtoken", { x: 0.7, y: 4.55, w: 8.6, h: 0.7, fontSize: 14, fontFace: "Times New Roman", color: B });

// ============ SLIDE 10: EXECUTION SCREENSHOTS ============
let slide10 = pres.addSlide();
slide10.background = { color: W };
slide10.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: P } });
slide10.addText("Execution Screenshots", { x: 0.5, y: 0.15, w: 9, h: 0.6, fontSize: 28, fontFace: "Times New Roman", color: W, bold: true });
slide10.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.9, w: 10, h: 0.05, fill: { color: A } });

const screenshots = [
  { title: "Homepage", x: 0.5, y: 1.2 },
  { title: "Product Catalog", x: 3.4, y: 1.2 },
  { title: "Shopping Cart", x: 6.3, y: 1.2 },
  { title: "Admin Dashboard", x: 0.5, y: 3.4 },
  { title: "Checkout Process", x: 3.4, y: 3.4 },
  { title: "Order Confirmation", x: 6.3, y: 3.4 }
];

screenshots.forEach(ss => {
  slide10.addShape(pres.shapes.RECTANGLE, { x: ss.x, y: ss.y, w: 2.8, h: 2, fill: { color: LG }, line: { color: G, width: 1 } });
  slide10.addText("[Screenshot]", { x: ss.x, y: ss.y, w: 2.8, h: 1.5, fontSize: 16, fontFace: "Times New Roman", color: G, align: "center", valign: "middle" });
  slide10.addShape(pres.shapes.RECTANGLE, { x: ss.x, y: ss.y + 1.5, w: 2.8, h: 0.5, fill: { color: S } });
  slide10.addText(ss.title, { x: ss.x, y: ss.y + 1.5, w: 2.8, h: 0.5, fontSize: 12, fontFace: "Times New Roman", color: W, bold: true, align: "center", valign: "middle" });
});

slide10.addText("Note: Replace placeholders with actual screenshots from application testing", { x: 0.5, y: 5.35, w: 9, h: 0.3, fontSize: 10, fontFace: "Times New Roman", color: G, italic: true, align: "center" });

// ============ SLIDE 11: CODE FILES ============
let slide11 = pres.addSlide();
slide11.background = { color: W };
slide11.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: P } });
slide11.addText("Code in Separate File", { x: 0.5, y: 0.15, w: 9, h: 0.6, fontSize: 28, fontFace: "Times New Roman", color: W, bold: true });
slide11.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.9, w: 10, h: 0.05, fill: { color: A } });

// Project structure
slide11.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 1.1, w: 9, h: 2.0, fill: { color: L }, line: { color: S, width: 1 }, rectRadius: 0.1 });
slide11.addText("Project Source Files", { x: 0.7, y: 1.2, w: 8.6, h: 0.4, fontSize: 18, fontFace: "Times New Roman", color: P, bold: true });
slide11.addText("├── index.html          → Main storefront page\n├── login.html          → User authentication\n├── admin.html          → Admin dashboard interface\n├── checkout.html       → Payment checkout page\n├── api/                → Backend API endpoints (users.js, login.js, products.js, orders.js)\n├── script.js           → Main frontend JavaScript\n└── server-pg.js        → Main Express server with PG integration", { x: 0.7, y: 1.65, w: 8.6, h: 1.3, fontSize: 13, fontFace: "Times New Roman", color: B });

// Database files
slide11.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 3.25, w: 9, h: 1.3, fill: { color: L }, line: { color: S, width: 1 }, rectRadius: 0.1 });
slide11.addText("Database Files", { x: 0.7, y: 3.35, w: 8.6, h: 0.4, fontSize: 18, fontFace: "Times New Roman", color: P, bold: true });
slide11.addText("├── init-db.js          → Database initialization script (78 lines)\n├── database-setup.sql  → PostgreSQL schema & seed data (148 lines)\n└── database-pgadmin.sql → pgAdmin compatibility version", { x: 0.7, y: 3.8, w: 8.6, h: 0.7, fontSize: 13, fontFace: "Times New Roman", color: B });

// Key code reference
slide11.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 4.7, w: 9, h: 0.8, fill: { color: S } });
slide11.addText("Key Files: server-pg.js, api/users.js, api/login.js, api/orders.js, api/products.js, init-db.js", { x: 0.7, y: 4.8, w: 8.6, h: 0.6, fontSize: 14, fontFace: "Times New Roman", color: W, align: "center", valign: "middle" });

// ============ SLIDE 12: CREATIVITY AND INNOVATION ============
let slide12 = pres.addSlide();
slide12.background = { color: W };
slide12.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: P } });
slide12.addText("Creativity and Innovation", { x: 0.5, y: 0.15, w: 9, h: 0.6, fontSize: 28, fontFace: "Times New Roman", color: W, bold: true });
slide12.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.9, w: 10, h: 0.05, fill: { color: A } });

const innovations = [
  { icon: "🎨", title: "Premium Design Aesthetic", desc: "Luxury-themed UI with elegant color schemes" },
  { icon: "📱", title: "PWA Implementation", desc: "Offline browsing, push notifications, app install" },
  { icon: "🔄", title: "Real-time Cart Sync", desc: "Persistent cart state across sessions & tabs" },
  { icon: "📧", title: "Automated Email System", desc: "Real email notifications via EmailJS" },
  { icon: "📊", title: "Admin Analytics", desc: "Sales insights and revenue tracking" },
  { icon: "🛡️", title: "Secure Payment Flow", desc: "PayU with PCI-compliant handling" }
];

innovations.forEach((item, i) => {
  const row = Math.floor(i / 2);
  const col = i % 2;
  const x = 0.5 + col * 4.7;
  const y = 1.1 + row * 1.45;
  
  slide12.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x, y: y, w: 4.5, h: 1.35, fill: { color: L }, line: { color: S, width: 1 }, rectRadius: 0.1 });
  slide12.addText(item.icon, { x: x + 0.1, y: y + 0.2, w: 0.6, h: 0.6, fontSize: 28, align: "center", valign: "middle" });
  slide12.addText(item.title, { x: x + 0.8, y: y + 0.15, w: 3.5, h: 0.4, fontSize: 16, fontFace: "Times New Roman", color: P, bold: true });
  slide12.addText(item.desc, { x: x + 0.8, y: y + 0.55, w: 3.5, h: 0.7, fontSize: 12, fontFace: "Times New Roman", color: G });
});

// ============ SLIDE 13: FUTURE SCOPE ============
let slide13 = pres.addSlide();
slide13.background = { color: W };
slide13.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: P } });
slide13.addText("Future Scope", { x: 0.5, y: 0.15, w: 9, h: 0.6, fontSize: 28, fontFace: "Times New Roman", color: W, bold: true });
slide13.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.9, w: 10, h: 0.05, fill: { color: A } });

const futureItems = [
  { icon: "🤖", title: "AI-Powered Recommendations", desc: "ML algorithms for personalized product suggestions" },
  { icon: "🥽", title: "Augmented Reality Try-On", desc: "AR integration for virtual clothing try-on" },
  { icon: "🏪", title: "Multi-Vendor Marketplace", desc: "Platform for multiple sellers with dashboards" },
  { icon: "📦", title: "Advanced Inventory Management", desc: "Barcode scanning and supplier integration" },
  { icon: "🌍", title: "Internationalization Support", desc: "Multi-currency and multilingual interface" },
  { icon: "🎁", title: "Loyalty & Rewards Program", desc: "Points-based system with tiered benefits" }
];

futureItems.forEach((item, i) => {
  const row = Math.floor(i / 2);
  const col = i % 2;
  const x = 0.5 + col * 4.7;
  const y = 1.1 + row * 1.45;
  
  slide13.addShape(pres.shapes.OVAL, { x: x, y: y + 0.2, w: 0.7, h: 0.7, fill: { color: A } });
  slide13.addText(item.icon, { x: x, y: y + 0.2, w: 0.7, h: 0.7, fontSize: 24, align: "center", valign: "middle" });
  slide13.addText(item.title, { x: x + 0.9, y: y + 0.1, w: 3.6, h: 0.4, fontSize: 16, fontFace: "Times New Roman", color: P, bold: true });
  slide13.addText(item.desc, { x: x + 0.9, y: y + 0.5, w: 3.6, h: 0.8, fontSize: 12, fontFace: "Times New Roman", color: G });
});

// ============ SLIDE 14: CONCLUSION ============
let slide14 = pres.addSlide();
slide14.background = { color: P };
slide14.addShape(pres.shapes.OVAL, { x: -1, y: -1, w: 3, h: 3, fill: { color: S } });
slide14.addShape(pres.shapes.OVAL, { x: 8.5, y: 4, w: 2.5, h: 2.5, fill: { color: A } });
slide14.addText("Conclusion", { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 36, fontFace: "Times New Roman", color: W, bold: true, align: "center" });
slide14.addShape(pres.shapes.RECTANGLE, { x: 4, y: 1.3, w: 2, h: 0.05, fill: { color: W } });
slide14.addText("The Velvora E-commerce platform successfully demonstrates the implementation of a comprehensive online retail solution with robust database management. Through careful integration of modern web technologies and secure payment processing, the system provides a complete shopping experience from product browsing to order fulfillment.\n\nThe project showcases effective use of PostgreSQL for data persistence, Node.js/Express for scalable backend architecture, and responsive frontend design for cross-platform compatibility. The admin dashboard enables efficient inventory and order management while maintaining data integrity through proper relational schema design.\n\nFuture enhancements will focus on AI-powered features, expanded payment options, and multi-vendor capabilities to further elevate the platform's competitive position in the e-commerce landscape.", {
  x: 0.8, y: 1.5, w: 8.4, h: 3.4, fontSize: 15, fontFace: "Times New Roman", color: W, align: "justify"
});
slide14.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.1, w: 10, h: 0.525, fill: { color: A } });
slide14.addText("Thank You!", { x: 0.5, y: 5.15, w: 9, h: 0.45, fontSize: 24, fontFace: "Times New Roman", color: W, bold: true, align: "center", valign: "middle" });

// ============ SLIDE 15: REFERENCES ============
let slide15 = pres.addSlide();
slide15.background = { color: W };
slide15.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: P } });
slide15.addText("References", { x: 0.5, y: 0.15, w: 9, h: 0.6, fontSize: 28, fontFace: "Times New Roman", color: W, bold: true });
slide15.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.9, w: 10, h: 0.05, fill: { color: A } });

const references = [
  "1. Supabase Documentation - https://supabase.com/docs",
  "2. Node.js Official Guide - https://nodejs.org/en/docs/",
  "3. Express.js Documentation - https://expressjs.com/",
  "4. PayU India Developer Portal - https://developer.payu.in/",
  "5. PostgreSQL Tutorial - https://www.postgresql.org/docs/",
  "6. MDN Web Docs (HTML/CSS/JS) - https://developer.mozilla.org/",
  "7. EmailJS Documentation - https://www.emailjs.com/docs/",
  "8. Vercel Deployment Guide - https://vercel.com/docs"
];
slide15.addText(references.join("\n"), { x: 0.8, y: 1.3, w: 8.4, h: 3.8, fontSize: 16, fontFace: "Times New Roman", color: B });
slide15.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.2, w: 10, h: 0.425, fill: { color: LG } });
slide15.addText("Velvora Luxury - E-Commerce Database Management System", { x: 0.5, y: 5.25, w: 9, h: 0.35, fontSize: 12, fontFace: "Times New Roman", color: G, align: "center" });

// Save
pres.writeFile({ fileName: "Velvora_Presentation.pptx" })
  .then(() => console.log("✅ Presentation created: Velvora_Presentation.pptx"))
  .catch(err => console.error("❌ Error:", err));
