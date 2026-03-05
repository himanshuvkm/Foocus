# Foocus 🚀

**Your Animated Companion for Focused Work (and a Little Fun!)**

---

## Badges

[![GitHub stars](https://img.shields.io/github/stars/himanshuvkm/Foocus?style=social)](https://github.com/himanshuvkm/Foocus/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/himanshuvkm/Foocus?style=social)](https://github.com/himanshuvkm/Foocus/network/members)
[![GitHub issues](https://img.shields.io/github/issues/himanshuvkm/Foocus)](https://github.com/himanshuvkm/Foocus/issues)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Top Language](https://img.shields.io/github/languages/top/himanshuvkm/Foocus)](https://github.com/himanshuvkm/Foocus)

---

## Description

Foocus is a lightweight, web-based Pomodoro and Stopwatch application designed with a focus on learning, experimentation, and a touch of creative "timepass." This project serves as a practical playground for exploring modern web development techniques while delivering a simple yet engaging user experience. It's built to help users manage their time effectively using the Pomodoro Technique or track activities with a straightforward stopwatch.

Beyond its core time-management functionalities, Foocus aims to make the process enjoyable. It incorporates an animated UI and theme-switching capabilities, transforming a typically mundane utility into a more dynamic and visually appealing tool. Whether you're genuinely striving for deep work or just looking for a stylish timer, Foocus offers a fun and interactive way to keep track of your productivity sessions.

---

## Key Features ✨

*   **Pomodoro Timer:** Implement the classic Pomodoro Technique for focused work intervals and short breaks.
*   **Stopwatch Functionality:** A versatile stopwatch for tracking various activities.
*   **Animated UI:** Engaging and smooth animations enhance the user experience.
*   **Theme Switching:** Customize your experience with different visual themes.
*   **Simple & Intuitive Controls:** Easy-to-use interface for seamless time management.
*   **Lightweight & Fast:** Built for performance and a responsive user experience.

[⬆️ Back to Top](#foocus-%F0%9F%9A%80)

---

## Tech Stack 🛠️

| Category       | Technology    | Description                                       |
| :------------- | :------------ | :------------------------------------------------ |
| **Framework**  | Next.js       | React framework for production.                   |
| **Language**   | TypeScript    | Typed superset of JavaScript.                     |
| **Styling**    | Tailwind CSS  | Utility-first CSS framework.                      |
| **Components** | Shadcn/UI     | Beautifully designed components.                  |
| **Linting**    | ESLint        | Pluggable JavaScript linter.                      |
| **Build Tool** | PostCSS       | Tool for transforming CSS with JavaScript plugins.|

[⬆️ Back to Top](#foocus-%F0%9F%9A%80)

---

## Getting Started 🚀

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/en/download/) (LTS version recommended)
*   [npm](https://www.npmjs.com/get-npm) or [Yarn](https://yarnpkg.com/getting-started/install)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/himanshuvkm/Foocus.git
    cd Foocus
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

### Environment Setup

Foocus currently does not require specific environment variables to run locally. All configurations are handled within the application logic.

### First Run

To start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

[⬆️ Back to Top](#foocus-%F0%9F%9A%80)

---

## Usage 💡

Foocus provides a straightforward interface. Simply navigate to the application in your browser after starting the development server.

*   **Switch between Pomodoro and Stopwatch:** Use the intuitive controls on the main screen to toggle between modes.
*   **Start/Pause/Reset:** Standard buttons control the timer's state.
*   **Theme Switching:** Look for a theme switcher (usually an icon like a sun/moon or a dropdown) to change the application's visual theme.

While there are no direct code examples for *using* the deployed application, here's an example of how a component like `TimerSection` might be used in `app/page.tsx`:

```tsx
// app/page.tsx
import TimerSection from '@/components/TimerSection';
import TaskList from '@/components/TaskList'; // Assuming TaskList is also part of the page

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* ... other layout elements ... */}
      <TimerSection />
      {/* <TaskList /> */} {/* Uncomment if you want to include task list functionality */}
    </main>
  );
}
```

[⬆️ Back to Top](#foocus-%F0%9F%9A%80)

---

## Project Structure 📁

```
Foocus/
├── .gitignore
├── README.md
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AnimatedDigit.tsx
│   ├── TaskList.tsx
│   ├── TimerCircle.tsx
│   ├── TimerSection.tsx
│   └── ui/
│       └── button.tsx
├── eslint.config.mjs
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── tailwind.config.ts
└── tsconfig.json
```

*   `app/`: Contains the main Next.js application routes and global styles.
*   `components/`: Houses reusable React components, including UI elements and specific timer parts.
*   `public/`: Stores static assets like images and favicons.
*   `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`: Configuration files for Next.js, Tailwind CSS, and PostCSS respectively.
*   `package.json`: Project metadata and dependencies.

[⬆️ Back to Top](#foocus-%F0%9F%9A%80)

---

## Configuration ⚙️

Foocus currently does not use any sensitive environment variables that need to be explicitly set. All application settings like timer durations or theme defaults are managed within the component logic itself.

For example, if you wanted to change default Pomodoro times, you would typically modify the `TimerSection.tsx` component or a related utility file.

[⬆️ Back to Top](#foocus-%F0%9F%9A%80)

---

## Testing 🧪

As of now, Foocus does not include a dedicated testing suite. The project was primarily built for learning and experimentation, with manual testing being the primary method of verification during development.

Future iterations may include:
*   Unit tests for individual components (e.g., `AnimatedDigit`, `TimerCircle`).
*   Integration tests for core functionalities (e.g., starting/pausing timers, theme switching).

[⬆️ Back to Top](#foocus-%F0%9F%9A%80)

---

## Deployment 🌐

Foocus is a Next.js application, making it straightforward to deploy to various platforms.

### Vercel (Recommended)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

1.  **Sign up for Vercel:** If you don't have an account, sign up at [vercel.com](https://vercel.com/).
2.  **Import your project:** Connect your GitHub repository to Vercel.
3.  **Deploy:** Vercel will automatically detect that it's a Next.js project and deploy it.

### Other Platforms

You can also deploy Foocus to other platforms that support Node.js applications, such as Netlify, AWS Amplify, or custom servers. Refer to the
