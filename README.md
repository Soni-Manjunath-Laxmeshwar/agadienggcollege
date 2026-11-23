# SKSVMACET Laxmeshwar - Modern College Web Portal

Official, modern web portal for **S.V.M.V.V. Society's Smt. Kamala and Sri Venkappa M. Agadi College of Engineering & Technology (SKSVMACET), Lakshmeshwar - 582116, Gadag District, Karnataka**.

Re-engineered to combine the modern collegiate styling of **KLE Technological University (`kletech.ac.in`)** with the dynamic event dispatch and notice ticker system of **IIT Dharwad (`iitdh.ac.in`)**, backed by real, authenticated data from **`agadiengcollege.com`**.

---

## 🏛️ Authentic Institutional Details

* **Institution:** Smt. Kamala and Sri Venkappa M. Agadi College of Engineering & Technology (SKSVMACET)
* **Founder:** Late Sri Venkappa M. Agadi & Smt. Kamala Agadi
* **Management:** S.V.M.V.V. Society (Shri Vidyaranya Mahaswamiji Vidya Vardhaka Samithi / Society, Lakshmeshwar)
* **Established:** 2003
* **Principal:** Dr. Parashuram Baraki, M.Tech, Ph.D. (`principal@agadiengcollege.com` / `+91 9686042385`)
* **IQAC Coordinator:** Dr. R. M. Patil (`hod.eee@agadiengcollege.com` / `+91 9975052933`)
* **Campus:** 45+ Acre lush green campus in Lakshmeshwar, Gadag District, Karnataka (1.5 km from Laxmeshwar Railway Station)
* **Official Institutional Codes:**
  * **VTU College Code:** `2KA` (Student USNs start with **`2KA`**, e.g., `2KA21CS045`, `2KA22EC012`)
  * **KEA CET Code:** `E167`
  * **COMED-K Code:** `E099`

---

## 🎓 Academic Departments & Verified Leadership

All 8 departments feature dedicated pages (`/departments/:id`) with authentic HOD profiles, faculty directories, lab equipment, and VTU syllabi:

1. **Computer Science & Engineering (CSE)**
   * **HOD:** Mr. Vikram Shirol (Associate Professor & HOD, M.Tech, Ph.D.) • `+91 9880728834` • `hod.cse@agadiengcollege.com`
   * **Student Association:** C-Cube Computing Association
   * **Faculty:** Mr. Vikram Shirol, Mr. Shrikant Jogar, Mr. Prakash Hongal, Mr. Basavaraj K M, Mr. Arun Kumbi, Mrs. Rajeshwari S G, Mr. Aneel Narayanpur, Mr. Nagaraj Baradeli.
2. **Artificial Intelligence & Machine Learning (AI & ML)**
   * **Program Lead:** Dr. Parashuram Baraki (Principal & Dept Lead) • `+91 9538012218` • `hod.aiml@agadiengcollege.com`
3. **Electronics & Communication Engineering (ECE)**
   * **HOD:** Dr. Subhas A. Meti (Professor & HOD, Ph.D.) • `+91 9449375371` • `hod.ece@agadiengcollege.com`
   * **Faculty:** Dr. Subhas A. Meti, Dr. Shivanandaswamy Mahapurush, Prof. Sunil Begumpur, Prof. Manjunathraddi Bentur.
4. **Electrical & Electronics Engineering (EEE)**
   * **HOD:** Dr. R. M. Patil (Professor & HOD, IQAC Coordinator, Ph.D.) • `+91 9975052933` • `hod.eee@agadiengcollege.com`
   * **Faculty:** Dr. R. M. Patil, Prof. Keshav Negalur.
5. **Civil Engineering (CV)**
   * **HOD:** Dr. Swapna Channagoudar (Associate Professor & HOD, M.Tech CAD Structure, Ph.D. Concrete) • `+91 8867617379` • `hod.civil@agadiengcollege.com`
   * **Consultancy:** PWD concrete testing and geotechnical soil analysis.
   * **Faculty:** Dr. Swapna Channagoudar, Dr. Shivarajkumar Goudar.
6. **Mechanical Engineering (ME)**
   * **HOD:** Dr. Sreenivasa R. (Associate Professor & HOD, Ph.D.) • `+91 9606476159` • `hod.mech@agadiengcollege.com`
   * **Student Association:** TORQUE Mechanical Engineers Association
   * **Faculty:** Dr. Sreenivasa R., Prof. Somashekhar C. Kerimani (NSS Officer).
7. **Information Science & Engineering (ISE)**
   * **HOD:** Dr. Arunkumar Joshi (Associate Professor & I/C HOD) • `+91 8497050599` / `+91 9663579700` • `hod.ise@agadiengcollege.com`
8. **First Year Engineering (General Science)**
   * **Lead:** Dr. Girish Yatinahalli (Associate Professor, Mathematics) • `girish.math@agadiengcollege.com`
   * **Faculty:** Dr. Mahesh Akki (Mathematics), Mr. S. N. Gondkar, Mr. J. Yallappa, Mr. Shanmukh G.

---

## 📚 Central Library: Prof. Venkata Subba Setti Library

* **Established:** 2003
* **Area & Capacity:** 919.9 Sq.m independent facility with 250 user seating capacity
* **Working Hours:** 9:30 AM to 8:30 PM (11 Hours Daily)
* **Collection:** **38,322+ Volumes**, **4,926+ Titles**
* **Periodicals:** 22 National Journals, 5 International Journals, 10 Magazines
* **Automation:** Koha Integrated Library Management System with Web OPAC
* **Subscribed E-Resources:** Elsevier (ScienceDirect), Springer Nature, IEEE ASPP & POP ALL, Emerald, EBSCO, Knimbus mLibrary App, Drillbit Plagiarism Detection
* **USN Validation:** Integrated book reservation modal validates and requires student USN to start with **`2KA`** (e.g. `2KA21CS045`).

---

## 💼 Training & Placement Cell (TPO) & Recruiters

* **Placement Coordinators:**
  * Mrs. Rajeshwari S G (CSE / AI) • `+91 9880728834`
  * Prof. Manjunathraddi Bentur (ECE) • `+91 9449375371`
  * Prof. Keshav Negalur (EEE) • `+91 9975052933`
  * Dr. Shivarajkumar Goudar (Civil) • `+91 8867617379`
* **Recruiters Grid:** Direct clickable cards linking to company corporate portals:
  * **Infosys, TCS, Wipro, Cognizant, Xoriant Solutions, Powercon Pune, MphasiS, NTT Data, SLK Software, Continental Automotive, Robert Bosch, Tech Mahindra**.

---

## 🚀 How to Run the Application

### Option 1: Unified Development Mode (Recommended)
Starts both the Express backend API and the Vite React frontend concurrently with one command:
```bash
npm run dev
```
* **Frontend UI:** `http://localhost:5173` (with live hot module replacement)
* **Backend API:** `http://localhost:5000` (SQLite relational database)
* All `/api/*` network requests from React are automatically proxied to the backend on port 5000.

---

### Option 2: Full-Stack Production Mode
Runs the Express backend server on port 5000, serving both the REST API and the compiled React production client:
```bash
# Build the React frontend
npm run build

# Start the full-stack server
npm start
```
Visit: **`http://localhost:5000`**

---

### Option 3: Backend Diagnostic Check
Test all SQLite database tables, relationships, and endpoints:
```bash
node scripts/test-api.js
```
