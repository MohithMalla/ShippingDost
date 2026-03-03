<div align="center">

# 🚛 ShippingDost
### *Empowering Kirana Stores with Intelligent Logistics*

[![Spring Boot](https://img.shields.io/badge/Spring--Boot-3.2.3-green?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=openjdk)](https://www.oracle.com/java/)
[![JaCoCo](https://img.shields.io/badge/Coverage-100%25-brightgreen?style=for-the-badge)](https://www.jacoco.org/)

**ShippingDost** is a high-performance B2B logistics platform built to optimize shipping costs between **Sellers**, **Warehouses**, and **Kirana Stores** using DSA-driven logic and real-time mapping.


</div>

---

## 📖 Description
**ShippingDost** bridges the gap between complex logistics math and user-friendly business tools. The name reflects its mission to be a **"Dost"** (friend) to small and medium enterprises, providing them with the same logistics intelligence used by global industry leaders.

---

## 🚀 Live Links
Check out the project live here:
* **Frontend (React):** [https://shipping-dost.netlify.app/](https://shipping-dost.netlify.app/)
* **Backend API (Spring Boot):** [https://shippingdost-4.onrender.com](https://shippingdost-4.onrender.com)

> **Note:** The backend is hosted on a free server. If it feels slow, please give it 30-60 seconds to "wake up" on the first request.

---

## 🌟 Key Features
* **🧠 Intelligent DSA Mode:** Uses the **Haversine Formula** to find the nearest warehouse and automatically selects between **Mini Van**, **Truck**, or **Air** based on distance thresholds.
* **💰 Dynamic Pricing:** Multi-variable engine calculating costs via weight, speed (Standard/Express), and **Customer Tiers** (Gold/Silver/Bronze).
* **🗺️ Visual Routing:** Interactive Leaflet maps showing the optimized path from Seller to Warehouse to Store.
* **📊 Audit Analytics:** Persistent database logging for historical tracking and business intelligence.

---

## 🛠️ Tech Stack
* **Backend:** Java 17, Spring Boot 3.2.3, Spring Security.
* **Frontend:** React.js, Tailwind CSS, Lucide Icons, Leaflet Maps.
* **Database:** MySQL / H2 (In-memory for testing).
* **Testing:** JUnit 5, MockMvc, JaCoCo (100% logic coverage).

---

## 🧠 Core Logic (How it works)

1. **Nearest Warehouse:** We calculate the distance between the Seller's location and all available warehouses using the Haversine formula to find the closest hub.
2. **Transport Selection:**
    * **Distance < 100km:** MINI_VAN (Rate: 3.0)
    * **Distance 100km - 500km:** TRUCK (Rate: 2.0)
    * **Distance > 500km:** AEROPLANE (Rate: 1.0)
3. **Pricing Formula:**
$$Total = (Distance \times TransportRate) + (Weight \times TierMultiplier) + SpeedPremium$$
    * **Gold Tier** customers pay a 8.0 multiplier, while others pay 12.0.

---

## 💻 How to Run Locally

### 1. Backend Setup
1. Navigate to the `backend` folder in your IDE (IntelliJ/VS Code).
2. Ensure you have **Java 17** and **Maven** installed.
3. Run the application:
   ```bash
   mvn spring-boot:run

### 2. Frontend Setup
1. Navigate to the frontend folder in your terminal.
2. Install dependencies:
```bash
    npm install
```
3. Start the development server:
```bash
npm run dev
```
4. Open your browser to http://localhost:5173

