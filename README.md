
<div align="center">
  <img src="public/logo.png" alt="LinkedIn Post Analyzer Logo" width="120" height="auto" />
  <h1>LinkedIn Post Analyzer</h1>
  <p>
    <strong>Unlock the Science of Virality.</strong><br>
    The ultimate toolkit for crafting high-performing LinkedIn content using AI-driven insights.
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#contributing">Contributing</a>
  </p>

  ![License](https://img.shields.io/badge/license-MIT-blue.svg)
  ![Next.js](https://img.shields.io/badge/Next.js-15.0-black)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
  ![Firebase](https://img.shields.io/badge/Firebase-11.0-orange)
</div>

<br />

## 🚀 About The Project

**LinkedIn Post Analyzer** is a premium, AI-powered workspace designed to help content creators, marketers, and professionals optimize their LinkedIn presence. By leveraging advanced natural language processing and virality frameworks, it transforms guesswork into data-backed strategy.

Built with a focus on **User Experience (UX)** and **Glassmorphism** aesthetics, the application provides a seamless, immersive environment for analyzing, testing, and perfecting your content.

## ✨ Key Features

### 🛠️ Core Tools
*   **Viral Pattern Decoder**: Analyzes your post against proven frameworks (PAS, AIDA, Hero's Journey) to ensure structural excellence.
*   **Hook & Fold Optimizer**: Simulates the LinkedIn "See More" fold, calculating a "curiosity score" for your first 3 lines.
*   **Audience Persona Simulator**: Uses AI to roleplay as different professionals (Recruiters, VCs, Founders) giving real-time feedback.
*   **Engagement Predictor**: proprietary "Virality Score" algorithm to forecast post performance before you publish.
*   **Competitor Analysis**: Benchmarks your content against industry leaders to identify gaps and opportunities.
*   **A/B Testing Simulator**: Generates intelligent variations of your post to test different angles and tones.

### 💎 User Experience
*   **Premium Glassmorphism Design**: A stunning, modern UI featuring ambient glows, blurred backgrounds, and smooth transitions.
*   **Real-time Analytics**: Interactive dashboards visualizing your growth, average scores, and best-performing topics.
*   **Secure Workspace**: Comprehensive user profiles, data export capabilities, and privacy-focused settings.

## 🏗️ Tech Stack

This project is built using the bleeding edge of modern web development:

| Category | Technologies |
|----------|--------------|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/), [Panda CSS](https://panda-css.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **UI Components** | [Ark UI](https://ark-ui.com/), [Lucide React](https://lucide.dev/), [Sonner](https://sonner.emilkowal.ski/) |
| **Backend / Auth** | [Firebase](https://firebase.google.com/) (Auth, Firestore) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Data Handling** | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/) |

## ⚡ Getting Started

Follow these steps to set up the project locally.

### Prerequisites

*   **Node.js**: v18 or higher
*   **npm** or **pnpm**

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/tahsinmert/postlytic.git
    cd postlytic
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Configure Environment Variables**
    Create a `.env.local` file in the root directory and add your Firebase configuration:
    ```bash
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  **Open the app**
    Visit [http://localhost:3000](http://localhost:9002) to see the application in action.

## 📂 Project Structure

```bash
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (main)/          # Authenticated routes (Dashboard, Tools)
│   │   └── (auth)/          # Authentication routes (Login, Register)
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Base UI elements (Buttons, Cards, Inputs)
│   │   └── tools/           # Tool-specific components
│   ├── hooks/               # Custom React hooks (useAuth, useToast)
│   └── lib/                 # Utilities and configurations (Firebase, Utils)
├── public/                  # Static assets
└── ...config files
```

## 🚀 Deployment

The project is optimized for deployment on **Vercel**.

1.  Push your code to a GitHub repository.
2.  Import the repository in Vercel.
3.  Add your Environment Variables in the Vercel dashboard.
4.  Click **Deploy**.

For detailed Vercel configuration, see `vercel.json`.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please look at the [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📮 Contact

Project Link: [https://github.com/tahsinmert/postlytic](https://github.com/tahsinmert/postlytic)
