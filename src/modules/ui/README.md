# Brutal Design System

A complete, production-ready design system for building industrial-strength user interfaces with raw, uncompromising aesthetics.

## 🏗️ Philosophy

> "Form follows function, stripped of all non-essential decoration"

The Brutal Design System embraces the architectural principles of Brutalism, translating concrete's raw material honesty into digital interfaces. Every component emphasizes:

- **Sharp, geometric forms** - No rounded corners, only precise angles
- **High contrast** - Pure black and white with strategic accent colors
- **Material honesty** - Thick borders and dramatic shadows reveal structure
- **Functional typography** - Bold, uppercase, wide-tracked text for maximum impact

## 📁 Module Structure

```
src/modules/ui/
├── brutal-theme.ts          # Core theme configuration
├── components/
│   ├── brutal-button.tsx    # Button variants
│   ├── brutal-forms.tsx     # Form components
│   ├── brutal-layout.tsx    # Layout components
│   └── brutal-advanced.tsx  # Advanced interactive components
├── index.ts                 # Main exports
├── examples.tsx             # Usage examples
└── README.md               # This documentation
```

## 🎨 Design Tokens

### Colors
```typescript
colors: {
  primary: {
    black: "#000000",      // Primary action, text
    white: "#ffffff",      // Background, secondary actions
    accent: "#ef4444",     // Error, destructive actions
    success: "#22c55e",    // Success states
    warning: "#eab308",    // Warning states
    info: "#3b82f6",      // Information states
  }
}
```

### Borders
- **Thin**: `2px` - Subtle divisions
- **Medium**: `4px` - Standard component borders
- **Thick**: `6px` - Prominent elements, buttons

### Shadows
- **Small**: `4px 4px` - Subtle depth
- **Medium**: `6px 6px` - Standard elevation
- **Large**: `8px 8px` - Prominent elevation
- **Extra Large**: `12px 12px` - Maximum impact
- **Stacked**: Multiple layered shadows for buttons

### Typography Scale
- **Display**: 4xl-6xl, font-black, uppercase, tight tracking
- **Heading**: 3xl, font-black, uppercase, wide tracking
- **Subheading**: 2xl-3xl, font-bold, uppercase
- **Title**: xl, font-black, uppercase
- **Body**: base, font-bold
- **Caption**: sm, font-bold, uppercase

## 🧩 Components

### Buttons
Monument-like presence with dramatic shadows and hover transforms.

```tsx
import { BrutalButton } from "@/modules/ui";

// Basic usage
<BrutalButton variant="primary">PRIMARY ACTION</BrutalButton>
<BrutalButton variant="secondary">SECONDARY</BrutalButton>
<BrutalButton variant="danger">DELETE</BrutalButton>

// With sizes
<BrutalButton size="sm">SMALL</BrutalButton>
<BrutalButton size="lg">LARGE</BrutalButton>
```

**Variants:**
- `primary` - Black background, white text, transforms on hover
- `secondary` - White background, black text, maintains identity on hover
- `danger` - Red background, white text, maintains red theme on hover

**Features:**
- Stacked shadows with asymmetric patterns
- Hover transforms (translate + shadow reduction)
- Monument-like visual weight

### Form Components
Sharp, functional form elements with high contrast and clear states.

```tsx
import { 
  BrutalInput, 
  BrutalLabel, 
  BrutalCheckbox, 
  BrutalFormField 
} from "@/modules/ui";

<BrutalFormField 
  label="YOUR NAME"
  description="ENTER YOUR FULL NAME"
  error="FIELD IS REQUIRED"
>
  <BrutalInput placeholder="JOHN DOE" />
</BrutalFormField>

<BrutalCheckbox id="terms" />
<BrutalLabel htmlFor="terms">ACCEPT TERMS</BrutalLabel>
```

**Components:**
- `BrutalInput` - Thick borders, focus states with shadow expansion
- `BrutalLabel` - Bold, uppercase labels
- `BrutalCheckbox` - 8x8 angular checkboxes with shadow effects
- `BrutalSelect` - Dropdown selects with brutal styling
- `BrutalBadge` - Status indicators (success, warning, error, info)
- `BrutalFormField` - Complete field wrapper with validation

### Layout Components
Structural elements for organizing content with brutal aesthetics.

```tsx
import { 
  BrutalCard, 
  BrutalTable, 
  BrutalContainer,
  BrutalSection 
} from "@/modules/ui";

<BrutalContainer size="lg">
  <BrutalSection title="DATA OVERVIEW">
    <BrutalCard variant="primary">
      <BrutalTable caption="SYSTEM COMPONENTS">
        <BrutalTableHeader>
          <BrutalTableRow>
            <BrutalTableHead>ID</BrutalTableHead>
            <BrutalTableHead>STATUS</BrutalTableHead>
          </BrutalTableRow>
        </BrutalTableHeader>
      </BrutalTable>
    </BrutalCard>
  </BrutalSection>
</BrutalContainer>
```

**Components:**
- `BrutalCard` - Primary/secondary card variants with thick borders
- `BrutalTable` - Complete table system with headers, rows, cells
- `BrutalSeparator` - Thick dividers (horizontal/vertical)
- `BrutalSkeleton` - Loading states with sharp edges
- `BrutalContainer` - Responsive containers (sm, md, lg, xl, full)
- `BrutalSection` - Content sections with optional titles

### Advanced Components
Complex interactive elements maintaining brutal design principles.

```tsx
import { 
  BrutalCalendar, 
  BrutalDialog, 
  BrutalPopover,
  BrutalAvatar 
} from "@/modules/ui";

// Calendar with sharp grid layout
<BrutalCalendar 
  selected={selectedDate}
  onSelect={setSelectedDate}
/>

// Modal dialogs
<BrutalDialog 
  trigger={<BrutalButton>OPEN DIALOG</BrutalButton>}
  title="CONFIRMATION"
  description="Are you sure you want to proceed?"
>
  <div className="flex gap-4">
    <BrutalButton variant="danger">DELETE</BrutalButton>
    <BrutalButton variant="secondary">CANCEL</BrutalButton>
  </div>
</BrutalDialog>

// User representation
<BrutalAvatar 
  src="/avatar.jpg"
  fallback="JD"
  size="lg"
/>
```

**Components:**
- `BrutalCalendar` - Date picker with navigation and grid layout
- `BrutalCommand` - Search/command palette with grouped items
- `BrutalDialog` - Modal dialogs with dramatic presence
- `BrutalPopover` - Contextual overlays
- `BrutalHoverCard` - Information tooltips
- `BrutalDropdownMenu` - Action menus with sharp styling
- `BrutalAvatar` - User representations with geometric fallbacks

## 🚀 Quick Start

### Installation
```bash
# Components are already included in the project
# Import from the ui module
```

### Basic Usage
```tsx
import { 
  BrutalButton, 
  BrutalCard, 
  BrutalInput,
  brutalTheme 
} from "@/modules/ui";

export const MyComponent = () => {
  return (
    <BrutalCard>
      <h2 className={brutalTheme.typography.heading}>
        CONTACT FORM
      </h2>
      <div className="space-y-4">
        <BrutalInput placeholder="YOUR NAME" />
        <BrutalInput placeholder="YOUR EMAIL" />
        <BrutalButton variant="primary">
          SEND MESSAGE
        </BrutalButton>
      </div>
    </BrutalCard>
  );
};
```

### Theme Access
```tsx
import { brutalTheme } from "@/modules/ui";

// Typography
<h1 className={brutalTheme.typography.display}>TITLE</h1>
<p className={brutalTheme.typography.body}>Content</p>

// Colors & borders
<div className={brutalTheme.borders.thick}>
  Thick border element
</div>

// Shadows
<div className={brutalTheme.shadows.lg}>
  Elevated element
</div>
```

## 📐 Design Principles

### 1. No Rounded Corners
Every element uses `rounded-none` for sharp, geometric forms that echo concrete's angular nature.

### 2. Thick Borders
Borders of 2-6px thickness create strong visual boundaries and hierarchy, revealing the structure beneath.

### 3. Dramatic Shadows
Offset shadows (not blurred) create depth through geometric displacement, like concrete casting shadows.

### 4. High Contrast
Pure black and white with strategic use of accent colors (red, green, yellow, blue) for maximum legibility.

### 5. Bold Typography
- Font weights: 700+ (bold, black)
- Text transform: uppercase
- Letter spacing: wide tracking
- No decorative fonts

### 6. Honest Materials
Visual elements reveal their structure - borders show boundaries, shadows show elevation, typography shows hierarchy.

## 🎯 Use Cases

### When to Use Brutal Design
- **Enterprise applications** requiring authority and trust
- **Developer tools** where function over form is paramount
- **Data-heavy interfaces** needing clear information hierarchy
- **Admin panels** requiring efficient task completion
- **Industrial applications** matching physical environment aesthetics

### When Not to Use
- Consumer-facing marketing sites
- Creative portfolios requiring elegant aesthetics
- Applications targeting emotional engagement
- Brands requiring soft, approachable interfaces

## 🔧 Customization

### Extending the Theme
```tsx
import { brutalTheme, cn } from "@/modules/ui";

// Custom component with brutal styling
const CustomBrutalComponent = () => (
  <div className={cn(
    brutalTheme.borders.medium,
    brutalTheme.shadows.lg,
    brutalTheme.base.sharp,
    "bg-white p-6"
  )}>
    Custom content
  </div>
);
```

### Creating Variants
```tsx
// Custom button variant
const BrutalWarningButton = (props) => (
  <BrutalButton 
    className="bg-yellow-500 text-black hover:bg-yellow-600"
    {...props}
  />
);
```

## 🧪 Testing

Components include proper TypeScript interfaces and can be tested using standard React testing patterns:

```tsx
import { render } from "@testing-library/react";
import { BrutalButton } from "@/modules/ui";

test("renders brutal button", () => {
  const { getByRole } = render(
    <BrutalButton>TEST BUTTON</BrutalButton>
  );
  expect(getByRole("button")).toHaveTextContent("TEST BUTTON");
});
```

## 📚 Examples

See `examples.tsx` for complete usage examples including:
- Contact forms
- Data cards
- Table layouts
- Interactive dialogs
- Calendar implementations

## 🤝 Contributing

When adding new components:

1. Follow the brutal design principles
2. Use the theme system for consistency
3. Include TypeScript interfaces
4. Add usage examples
5. Maintain sharp, geometric aesthetics

## 📄 License

Part of the Kuama Control Center project.

---

*"Architecture is a social act and the material theater of human activity."* - Spiro Kostof

The Brutal Design System translates this philosophy into digital interfaces, creating spaces for efficient human-computer interaction through honest, functional design.