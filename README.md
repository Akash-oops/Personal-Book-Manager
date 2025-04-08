1.What I Built? 
Created a Personal Bookmark Manager web app that allows users to: 
Save, edit, and delete bookmarks. 
Organize bookmarks by categories.
Search and sort bookmarks.
It’s built with Next.js, TypeScript, and Tailwind CSS for a clean and responsive UI.

2.How to Run the Project
->Clone this repository:
```bash
git clone https://github.com/your-username/bookmark-manager.git
cd "your folder path"

Install dependencies:
```bash
npm install

Run the development server:
```bash
npm run dev

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


3.Which Features Implemented 
->Add and delete bookmarks 
->Edit bookmarks 
->Custom category creation 
-> Sort bookmarks by date or title 
->Search bookmarks by title 
->URL validation before saving 
->Dark mode


4.Challenges Faced 
->Managing Edit Mode Cleanly 
->Reliable URL Validation 
->Dynamic Sorting and Searching 
->Custom Categories with Persistence

5.What I Learned 
->How to build a full-featured React app with Next.js and TypeScript from scratch. 
->Using localStorage for client-side persistence. 
->Creating responsive and clean UIs with Tailwind CSS. 
->Managing multiple states cleanly (filters, sort, dark mode, edit mode). 
->Generating PDFs from HTML using jsPDF and html2canvas.


Dependencies Used:
1. Create the project
```bash
npx create-next-app@latest bookmark-manager --typescript

2. Navigate into project
```bash
cd bookmark-manager

3. Install Tailwind CSS
bash
```npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p

4. Install PDF dependencies
```bash
npm install jspdf html2canvas

5. Run the development server
bash
```npm run dev
