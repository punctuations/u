import React from "react";
import satori from "satori";

// Simple JSX parser to convert JSX string to React elements
function parseJSX(jsxString: string): React.ReactElement {
	// Remove leading/trailing whitespace
	jsxString = jsxString.trim();

	// Check if the string is empty
	if (!jsxString) {
		return React.createElement("div", null);
	}

	// Stack to track nesting of elements
	const stack: Array<{
		tagName: string;
		props: Record<string, any>;
		children: React.ReactNode[];
	}> = [];

	// Current element being parsed
	let currentElement: {
		tagName: string;
		props: Record<string, any>;
		children: React.ReactNode[];
	} | null = null;

	// Current position in the string
	let pos = 0;

	// Parse the JSX string
	while (pos < jsxString.length) {
		// Opening tag
		if (jsxString[pos] === "<" && jsxString[pos + 1] !== "/") {
			pos++; // Skip '<'

			// Extract tag name
			let tagName = "";
			while (pos < jsxString.length && !/[\s/>]/.test(jsxString[pos])) {
				tagName += jsxString[pos];
				pos++;
			}

			// Skip whitespace
			while (pos < jsxString.length && /\s/.test(jsxString[pos])) {
				pos++;
			}

			// Parse props
			const props: Record<string, any> = {};
			while (
				pos < jsxString.length &&
				jsxString[pos] !== ">" &&
				jsxString[pos] !== "/"
			) {
				// Extract prop name
				let propName = "";
				while (pos < jsxString.length && /[a-zA-Z0-9_]/.test(jsxString[pos])) {
					propName += jsxString[pos];
					pos++;
				}

				// Skip whitespace and equals sign
				while (pos < jsxString.length && /[\s=]/.test(jsxString[pos])) {
					pos++;
				}

				// Extract prop value
				if (jsxString[pos] === '"' || jsxString[pos] === "'") {
					const quote = jsxString[pos];
					pos++; // Skip opening quote

					let propValue = "";
					while (pos < jsxString.length && jsxString[pos] !== quote) {
						propValue += jsxString[pos];
						pos++;
					}

					props[propName] = propValue;
					pos++; // Skip closing quote
				} else if (jsxString[pos] === "{") {
					pos++; // Skip '{'

					let propValue = "";
					let braceCount = 1;

					while (pos < jsxString.length && braceCount > 0) {
						if (jsxString[pos] === "{") braceCount++;
						else if (jsxString[pos] === "}") braceCount--;

						if (braceCount > 0) {
							propValue += jsxString[pos];
						}
						pos++;
					}

					// Try to evaluate the expression
					try {
						// For object literals and complex expressions, add surrounding braces if needed
						if (
							propValue.trim().startsWith("{") &&
							propValue.trim().endsWith("}")
						) {
							// Already has braces, just evaluate it
							props[propName] = Function(`return ${propValue}`)();
						} else if (propValue.includes(":")) {
							// Likely an object literal that needs braces
							const objStr = `({${propValue}})`;
							props[propName] = Function(`return ${objStr}`)();
						} else {
							// Simple expression
							props[propName] = Function(`return ${propValue}`)();
						}
					} catch (e) {
						console.warn(
							`Failed to evaluate prop ${propName}: ${propValue}`,
							e
						);
						props[propName] = propValue; // Fallback to string
					}
				}

				// Skip whitespace
				while (pos < jsxString.length && /\s/.test(jsxString[pos])) {
					pos++;
				}
			}

			// Create new element
			const newElement = {
				tagName,
				props,
				children: [],
			};

			// Self-closing tag
			if (jsxString[pos] === "/" && jsxString[pos + 1] === ">") {
				pos += 2; // Skip '/>'

				if (stack.length === 0) {
					// Root element
					currentElement = newElement;
					break;
				} else {
					// Child of parent element
					stack[stack.length - 1].children.push(
						React.createElement(newElement.tagName, newElement.props)
					);
				}
			} else {
				pos++; // Skip '>'

				if (stack.length === 0) {
					// Root element
					currentElement = newElement;
				} else {
					// Child of parent element
					stack[stack.length - 1].children.push(newElement);
				}

				stack.push(newElement);
			}
		}
		// Closing tag
		else if (jsxString[pos] === "<" && jsxString[pos + 1] === "/") {
			pos += 2; // Skip '</'

			// Extract tag name
			let tagName = "";
			while (pos < jsxString.length && jsxString[pos] !== ">") {
				tagName += jsxString[pos];
				pos++;
			}
			pos++; // Skip '>'

			// Pop element from stack
			const element = stack.pop();

			if (element?.tagName !== tagName) {
				console.warn(`Mismatched tags: ${element?.tagName} vs ${tagName}`);
			}

			if (stack.length === 0 && element) {
				// Root element
				currentElement = element;
				break;
			}
		}
		// Text content
		else {
			let text = "";
			while (pos < jsxString.length && jsxString[pos] !== "<") {
				text += jsxString[pos];
				pos++;
			}

			// Add text node to parent element
			if (stack.length > 0 && text.trim()) {
				stack[stack.length - 1].children.push(text.trim());
			}
		}
	}

	// Convert to React element
	if (!currentElement) {
		return React.createElement("div", null);
	}

	// Recursive function to convert nested elements
	function createElement(element: {
		tagName: string;
		props: Record<string, any>;
		children: React.ReactNode[];
	}): React.ReactElement {
		// For div elements with multiple children, ensure they have display: flex
		if (
			element.tagName.toLowerCase() === "div" &&
			element.children.length > 1
		) {
			// Add display flex to div if not already specified
			if (!element.props.style) {
				element.props.style = { display: "flex", flexDirection: "column" };
			} else if (
				typeof element.props.style === "object" &&
				!element.props.style.display
			) {
				element.props.style = {
					...element.props.style,
					display: "flex",
					flexDirection: "column",
				};
			}
		}

		return React.createElement(
			element.tagName,
			element.props,
			...element.children.map((child) => {
				if (typeof child === "string") {
					return child;
				} else if (typeof child === "object" && "tagName" in child!) {
					return createElement(child as any);
				} else {
					return child;
				}
			})
		);
	}

	return createElement(currentElement);
}

export async function convert(jsx: string) {
	// Get background and custom font from JSX if they exist
	const hasCustomFont = jsx.includes("@import url");
	const hasBackground = jsx.includes("background-image");

	// Extract background URL if present
	let backgroundImage = "";
	if (hasBackground) {
		const bgMatch = jsx.match(/background-image:\s*url\(([^)]+)\)/);
		if (bgMatch && bgMatch[1]) {
			backgroundImage = bgMatch[1];
		}
	}

	// Extract dark mode setting if present
	const isDarkMode = jsx.includes('"#000"') || jsx.includes('"#fff"');

	// Convert JSX string into React element objects
	const reactElement = parseJSX(jsx);

	const document = (
		<html>
			<body
				style={{
					fontFamily:
						"Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					width: "100%",
					height: "100%",
					textAlign: "center",
					letterSpacing: "-0.025em",
					lineHeight: "1.4",
					backgroundColor: isDarkMode ? "#000" : "#fff",
					...(backgroundImage
						? {
								backgroundImage: `url(${backgroundImage})`,
								backgroundPosition: "center",
								backgroundSize: "cover",
								backgroundOrigin: "border-box",
						  }
						: {}),
				}}
			>
				{reactElement}
			</body>
		</html>
	);

	return await satori(document, {
		width: 1920,
		height: 1080,
		embedFont: true,
		fonts: [
			{
				name: "Inter",
				data: await fetch(
					"https://fonts.cdnfonts.com/s/19795/Inter-Regular.woff"
				).then((res) => res.arrayBuffer()),
				weight: 400,
				style: "normal",
			},
			{
				name: "Inter",
				data: await fetch(
					"https://fonts.cdnfonts.com/s/19795/Inter-Bold.woff"
				).then((res) => res.arrayBuffer()),
				weight: 700,
				style: "normal",
			},
			{
				name: "Fluent Emoji",
				data: await fetch(
					"https://tetunori.github.io/fluent-emoji-webfont/dist/FluentEmojiColor.ttf"
				).then((res) => res.arrayBuffer()),
				weight: 400,
				style: "normal",
			},
		],
	});
}
