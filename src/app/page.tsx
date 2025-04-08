"use client";

import { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Bookmark {
  id: string;
  title: string;
  url: string;
  category: string;
  createdAt: Date;
}

export default function Home() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  const [customCategories, setCustomCategories] = useState<string[]>(["Tech", "Education", "Entertainment"]);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("date");
  const [darkMode, setDarkMode] = useState(false);
  const bookmarksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("bookmarks");
    if (saved) {
      const parsed: Bookmark[] = JSON.parse(saved);
      const withDates = parsed.map((b) => ({
        ...b,
        createdAt: new Date(b.createdAt),
      }));
      setBookmarks(withDates);
    }

    const storedMode = localStorage.getItem("darkMode");
    if (storedMode) setDarkMode(storedMode === "true");

    const storedCategories = localStorage.getItem("categories");
    if (storedCategories) setCustomCategories(JSON.parse(storedCategories));
  }, []);

  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(customCategories));
  }, [customCategories]);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const addBookmark = () => {
    if (!title || !url || !category) return;
    if (!isValidUrl(url)) {
      alert("Please enter a valid URL.");
      return;
    }

    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      title,
      url,
      category,
      createdAt: new Date(),
    };

    setBookmarks([...bookmarks, newBookmark]);
    setTitle("");
    setUrl("");
    setCategory("");
  };

  const deleteBookmark = (id: string) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (confirmDelete) {
      setBookmarks(bookmarks.filter((b) => b.id !== id));
    }
  };

  const startEditing = (bookmark: Bookmark) => {
    setEditingId(bookmark.id);
    setEditTitle(bookmark.title);
    setEditUrl(bookmark.url);
    setEditCategory(bookmark.category);
  };

  const saveEdit = (id: string) => {
    const updated = bookmarks.map((b) =>
      b.id === id ? { ...b, title: editTitle, url: editUrl, category: editCategory } : b
    );
    setBookmarks(updated);
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const addCustomCategory = () => {
    if (newCategory && !customCategories.includes(newCategory)) {
      setCustomCategories([...customCategories, newCategory]);
      setNewCategory("");
    }
  };

  const downloadPDF = async () => {
    const input = bookmarksRef.current;
    if (input) {
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("bookmarks.pdf");
    }
  };

  // Filtering + Searching
  const filtered = filterCategory === "All"
    ? bookmarks
    : bookmarks.filter((b) => b.category === filterCategory);

  const searched = filtered.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sorted = [...searched].sort((a, b) => {
    if (sortOption === "title") return a.title.localeCompare(b.title);
    return b.createdAt.getTime() - a.createdAt.getTime(); // default: newest first
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-900 text-black dark:text-white transition-colors">
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-4 right-4 p-2 bg-gray-300 dark:bg-gray-700 rounded"
      >
        {darkMode ? "🌞 Light" : "🌙 Dark"}
      </button>

      <h1 className="text-2xl font-bold mb-6">Bookmark Manager</h1>

      {/* Add Bookmark Form */}
      <div className="w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
        />
        <input
          type="url"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
        >
          <option value="">Select Category</option>
          {customCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button
          onClick={addBookmark}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Add Bookmark
        </button>
      </div>

      {/* Custom Category Input */}
      <div className="w-full max-w-md mt-4 flex gap-2">
        <input
          type="text"
          placeholder="New category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
        />
        <button
          onClick={addCustomCategory}
          className="bg-purple-600 text-white px-3 rounded hover:bg-purple-700"
        >
          Add
        </button>
      </div>

      {/* Filter + Search + Sort */}
      <div className="w-full max-w-md mt-6 space-y-2">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
        >
          <option value="All">All Categories</option>
          {customCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
        />

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
        >
          <option value="date">Sort by Date</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>

      {/* PDF Button */}
      {sorted.length > 0 && (
        <button
          onClick={downloadPDF}
          className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Download PDF
        </button>
      )}

      {/* Bookmark List */}
      <div ref={bookmarksRef} className="w-full max-w-md mt-6 space-y-4">
        <h2 className="text-xl font-semibold">Your Bookmarks</h2>
        {sorted.length === 0 ? (
          <p>No bookmarks found.</p>
        ) : (
          sorted.map((bookmark) => (
            <div
              key={bookmark.id}
              className="p-4 border rounded shadow-sm hover:shadow-md transition relative dark:bg-gray-800 dark:border-gray-600"
            >
              {editingId === bookmark.id ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full p-2 border rounded mb-2 dark:bg-gray-700"
                  />
                  <input
                    type="url"
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    className="w-full p-2 border rounded mb-2 dark:bg-gray-700"
                  />
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full p-2 border rounded mb-2 dark:bg-gray-700"
                  >
                    {customCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="flex justify-end gap-2 mt-2">
                    <button onClick={() => saveEdit(bookmark.id)} className="text-green-600 hover:text-green-800">
                      ✅
                    </button>
                    <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-700">
                      ❌
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p
  className="font-bold truncate w-full"
  title={bookmark.title}
>
  {bookmark.title}
</p>
<a
  href={bookmark.url}
  target="_blank"
  rel="noopener noreferrer"
  className="text-blue-600 underline truncate w-full block"
  title={bookmark.url}
>
  {bookmark.url}
</a>
                  <p className="text-sm text-gray-600">Category: {bookmark.category}</p>
                  <p className="text-xs text-gray-400">Added on: {bookmark.createdAt.toLocaleString()}</p>

                  <div className="absolute top-2 right-2 flex gap-2">
                    <button onClick={() => deleteBookmark(bookmark.id)} className="text-red-500 hover:text-red-700">
                      ❌
                    </button>
                    <button onClick={() => startEditing(bookmark)} className="text-yellow-500 hover:text-yellow-600">
                      ✏️
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
