# How the UI and JavaScript work together

## 1. A component is a function

A React component is a JavaScript function that returns JSX (HTML-like UI syntax). `ProductCard` is one reusable function; every product passes different data into it through **props**.

```jsx
<ProductCard product={product} />
```

`product={product}` means “pass this JavaScript object into the component.” Curly braces inside JSX let you use a JavaScript expression.

## 2. State stores values that change on screen

```jsx
const [size, setSize] = useState('');
```

`size` is the current value. `setSize('M')` updates it and asks React to render the component again. Unlike a normal local variable, state survives subsequent renders.

```jsx
<button onClick={() => setSize('M')}>M</button>
```

`onClick` receives a function. React calls that function when the user clicks. We do not write `onClick={setSize('M')}` because that would execute during rendering.

## 3. Conditional rendering connects state to the design

```jsx
<button className={size === 'M' ? 'selected' : ''}>M</button>
```

JavaScript chooses a class; CSS decides how the selected button looks. This is the connection between **logic** and **UI styling**.

## 4. Arrays turn into UI with map()

```jsx
products.map(product => (
  <ProductCard key={product.id} product={product} />
))
```

`map()` returns a card for every object. `key` gives React a stable identity for each card; it is not displayed on screen.

In `Catalog.jsx`, products first pass through `filter()`, then `sort()`, then `map()`. The search input uses `value={search}` and updates through `onChange`.

## 5. Context shares state between pages

The cart badge, bag drawer and checkout need the same cart. `StoreProvider` holds that shared state. `useStore()` reads the values and actions from that provider.

Think of the provider as one shared store object for the component tree. React Context distributes access without passing cart props through every parent component.

## 6. Update arrays without changing the old array

```jsx
setWishlist(previous => [...previous, productId]);
```

The spread syntax creates a new array. React relies on new state values to recognize updates. The callback form uses the latest state, even when multiple actions happen close together.

Cart entries use product ID + size + colour as their identity, so different variants stay separate.

## 7. Effects handle browser storage

`useEffect` loads saved shopping data after the component mounts. Another effect writes changes after the initial load. The `ready` flag prevents the empty initial state from overwriting the saved cart.

`localStorage` survives page reloads. `sessionStorage` lasts for the current browser session. Neither is a database or a safe place to store passwords.

## 8. Forms and validation

`event.preventDefault()` stops the browser's normal form reload. `new FormData(event.currentTarget)` reads the fields. HTML attributes (`required`, `type="email"`, `minLength`) provide basic validation; JavaScript checks matching passwords and phone formatting.

The account and checkout forms are demonstrations. They never send credentials or payment data to a server.

## 9. Animations are mostly CSS

The hero and cards use keyframe animations; image hover uses a transform transition. The cart drawer uses a native `<dialog>` for focus handling and a slide-in animation. A `prefers-reduced-motion` media query disables movement for visitors who request it.

## Suggested practice

1. Change a product price in `products.js` and observe the card and cart totals.
2. Add a ninth product with a unique ID and a local image.
3. Add a category option by assigning that category to a product; the filter derives its options automatically.
4. Change the delivery threshold in `totals()`. Then also update the matching display copy.
5. Trace the entire flow: size button → state update → Add to bag → shared cart → checkout total.

Backend work comes later. First understand each component, then connect one feature at a time to a real API.

## Search and offline preview

`SearchDialog.jsx` uses a native dialog and controlled input. Matching products are derived from the query, and React Router handles selecting a result. The offline build switches to `HashRouter` and embeds all product images in one HTML file. Google sign-in is a labelled demo flow; it does not contact Google or authenticate a real account.
