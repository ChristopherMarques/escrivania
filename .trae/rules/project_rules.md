### **1. Environment & Tooling**

1.  **Package Manager**:
    - **Rule**: Use `pnpm` as the default package manager for all Node.js projects.
    - **Justification**: `pnpm` is more efficient in terms of speed and disk space, preventing package duplication and common issues with nested dependencies.
    - **Configuration**: Add a `.npmrc` file to the project root with the following content to ensure compatibility with libraries that rely on hoisting:
      ```
      shamefully-hoist=true
      ```

2.  **Command Line**:
    - **Rule**: Always generate commands for Windows `cmd` (Command Prompt), avoiding PowerShell.
    - **Justification**: This ensures maximum compatibility and consistency across different Windows development environments, bypassing the need to adjust PowerShell-specific Execution Policies.

### **2. Code & Architecture Principles**

3.  **SOLID**:
    - **Rule**: Strictly apply the five SOLID principles throughout the software architecture.
    - **Details**:
      - **(S) Single Responsibility Principle**: Every component, class, or function must have a single, well-defined responsibility.
      - **(O) Open/Closed Principle**: Code should be open for extension but closed for modification. Favor composition and dependency injection over complex inheritance.
      - **(L) Liskov Substitution Principle**: Subtypes must be substitutable for their base types without altering the correctness of the program.
      - **(I) Interface Segregation Principle**: Create small, client-specific interfaces rather than one monolithic interface.
      - **(D) Dependency Inversion Principle**: High-level modules should not depend on low-level modules. Both should depend on abstractions.

4.  **Clean Code & Clean Architecture**:
    - **Rule**: Base the code structure on the principles of _Clean Code_ (by Robert C. Martin) and _Clean Architecture_.
    - **Details**:
      - **Meaningful Names**: Variables, functions, and components should have clear names that reveal their intent.
      - **Small Functions**: Functions should be short and do only one thing.
      - **Layer Separation**: Isolate UI logic, business logic (use cases), and data access (APIs, database) into distinct layers.

5.  **DRY (Don't Repeat Yourself)**:
    - **Rule**: Avoid code repetition at all costs.
    - **Application**: Whenever duplicated logic, values, or structures are identified, the first action should be to abstract this duplication into a reusable function, hook, component, or variable.

### **3. Structure, Naming & Typing**

6.  **Naming Convention**:
    - **Rule**: For component and module file/folder names, use the `kebab-case` pattern.
    - **Examples**:
      - Component folder: `/components/user-profile/`
      - Component file: `user-profile.tsx`
      - Style file: `user-profile.module.css`

7.  **Strong Typing**:
    - **Rule**: All code must be strongly typed using TypeScript. The use of `any` should be avoided and justified.
    - **Application**: Explicitly type component props, states, function returns, and complex variables. Use types and interfaces to define clear data contracts, especially for API responses.

### **4. Performance & Optimization**

8.  **Strategic Rendering**:
    - **Rule**: Prioritize the use of **Server-Side Rendering (SSR)** and **Static Site Generation (SSG)** in Next.js projects to optimize performance.
    - **Details**:
      - **SSG (`getStaticProps`)**: Use for pages where content is static or can be pre-rendered at build time (e.g., blog posts, marketing pages).
      - **SSR (`getServerSideProps`)**: Use for pages that require fresh data on every request (e.g., user dashboards, search results).
      - **ISR (Incremental Static Regeneration)**: Apply to SSG pages that need to be updated periodically without a new build.

9.  **Cache and Performance**:
    - **Rule**: Actively optimize caching and performance across all layers of the application.
    - **Tactics**:
      - **Data Caching**: Use data caching strategies for APIs (e.g., `revalidate` in Next.js, React Query, SWR).
      - **Image Optimization**: Use the `next/image` component for automatic image optimization.
      - **Code Splitting**: Dynamically load components and libraries only when they are needed using `next/dynamic`.
      - **Lazy Loading**: Apply lazy loading for components, images, and videos that are outside the initial viewport.

### **5. UI/UX Design**

10. **Mobile First**:
    - **Rule**: All UI/UX design and implementation must follow the _Mobile First_ approach.
    - **Justification**: This ensures a solid user experience on the most widely used platform, treating larger screens as a progressive enhancement.
    - **Primary Focus**: Usability on smaller screens, especially for **navigation menus, forms, and buttons**, must be the initial priority during development. Interaction should be simple and intuitive, following Steve Krug's "Don't Make Me Think" philosophy.
