# 🚀 JSON Schema Builder

> **A modern, interactive, and extensible tool for visually building and previewing JSON schemas.**

---

![JSON Schema Builder Banner](https://dummyimage.com/900x200/222/fff&text=JSON+Schema+Builder)

---

## ✨ Features

- **Visual Schema Construction**: Drag, drop, and nest fields to build complex JSON schemas with ease.
- **Live JSON Preview**: Instantly see the generated JSON as you edit your schema.
- **Nested Objects**: Support for deeply nested structures and various field types.
- **Type Safety**: Built with TypeScript for robust developer experience.
- **Modern UI**: Clean, responsive, and accessible interface powered by React and Tailwind CSS.
- **Extensible**: Easily add new field types or validation rules.

---

## 🛠️ Tech Stack

- **React** (with Hooks)
- **TypeScript**
- **Tailwind CSS**
- **react-hook-form** (for form state management)
- **Vite** (for blazing fast dev/build)

---

## 🚦 Quick Start

```bash
# 1. Clone the repo
$ git clone https://github.com/Amritkumar01/HROne-Frontend-Assignment-
$ cd HROne-Frontend-Assignment-

# 2. Install dependencies
$ npm install

# 3. Start the development server
$ npm run dev

# 4. Open in your browser
# Visit http://localhost:5173
```

---

## 🧑‍💻 Usage

- **Add Fields**: Click "Add Item" to add a new field.
- **Edit Fields**: Change the name, type, or required status. Select "nested" to add sub-fields.
- **Remove Fields**: Click the ❌ icon to delete a field.
- **Preview**: The right panel always shows the live JSON output.

### Example

```json
{
  "name": "STRING",
  "age": "number",
  "profile": {
    "bio": "STRING",
    "isActive": "boolean"
  }
}
```

---

## 🏗️ Project Structure

```
json-schema-builder/
├── src/
│   ├── components/
│   │   └── JsonSchemaBuilder.tsx  # Main builder component
│   ├── lib/
│   │   └── utils.ts               # Utility functions
│   ├── App.tsx                    # App entry
│   └── ...
├── public/
├── package.json
└── ...
```

---

## 🤝 Contributing

We love contributions! Here’s how you can help:

1. **Fork** the repo and create your branch: `git checkout -b feature/your-feature`
2. **Commit** your changes: `git commit -am 'Add new feature'`
3. **Push** to the branch: `git push origin feature/your-feature`
4. Create a Pull Request

Please follow the existing code style and add tests where appropriate.

---

## 🧪 Developer Notes

- All form state is managed via `react-hook-form` and updates are fully type-safe.
- Nested field updates are handled recursively for robust schema editing.
- The UI is fully responsive and accessible.
- For custom field types or validation, extend the `SchemaField` type and update the builder logic.

---

## 📄 Made By
 Amrit Kumar

---

[GitHub Repository](https://github.com/Amritkumar01/HROne-Frontend-Assignment-)
