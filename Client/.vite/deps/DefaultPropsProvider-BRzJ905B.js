import { r as __toESM, t as require_react } from "./react-TUYU05Ph.js";
import { D as require_prop_types, _ as require_jsx_runtime, c as resolveProps, n as createTheme, t as identifier_default, u as createStyled } from "./identifier-Blietev0.js";
//#region node_modules/@mui/system/esm/DefaultPropsProvider/DefaultPropsProvider.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_prop_types = /* @__PURE__ */ __toESM(require_prop_types(), 1);
var import_jsx_runtime = require_jsx_runtime();
var PropsContext = /* @__PURE__ */ import_react.createContext(void 0);
function DefaultPropsProvider$1({ value, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PropsContext.Provider, {
		value,
		children
	});
}
DefaultPropsProvider$1.propTypes = {
	children: import_prop_types.default.node,
	value: import_prop_types.default.object
};
function getThemeProps(params) {
	const { theme, name, props } = params;
	if (!theme || !theme.components || !theme.components[name]) return props;
	const config = theme.components[name];
	if (config.defaultProps) return resolveProps(config.defaultProps, props, theme.components.mergeClassNameAndStyle);
	if (!config.styleOverrides && !config.variants) return resolveProps(config, props, theme.components.mergeClassNameAndStyle);
	return props;
}
function useDefaultProps$1({ props, name }) {
	return getThemeProps({
		props,
		name,
		theme: { components: import_react.useContext(PropsContext) }
	});
}
//#endregion
//#region node_modules/@mui/material/esm/styles/defaultTheme.js
var defaultTheme = createTheme();
//#endregion
//#region node_modules/@mui/material/esm/styles/slotShouldForwardProp.js
function slotShouldForwardProp(prop) {
	return prop !== "ownerState" && prop !== "theme" && prop !== "sx" && prop !== "as";
}
//#endregion
//#region node_modules/@mui/material/esm/styles/rootShouldForwardProp.js
var rootShouldForwardProp = (prop) => slotShouldForwardProp(prop) && prop !== "classes";
//#endregion
//#region node_modules/@mui/material/esm/styles/styled.js
var styled = createStyled({
	themeId: identifier_default,
	defaultTheme,
	rootShouldForwardProp
});
//#endregion
//#region node_modules/@mui/material/esm/DefaultPropsProvider/DefaultPropsProvider.js
function DefaultPropsProvider(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DefaultPropsProvider$1, { ...props });
}
DefaultPropsProvider.propTypes = {
	children: import_prop_types.default.node,
	value: import_prop_types.default.object.isRequired
};
function useDefaultProps(params) {
	return useDefaultProps$1(params);
}
//#endregion
export { defaultTheme as i, styled as n, rootShouldForwardProp as r, useDefaultProps as t };

//# sourceMappingURL=DefaultPropsProvider-BRzJ905B.js.map