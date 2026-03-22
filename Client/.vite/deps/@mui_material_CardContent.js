import { r as __toESM, t as require_react } from "./react-TUYU05Ph.js";
import { D as require_prop_types, E as clsx, T as composeClasses, _ as require_jsx_runtime, d as generateUtilityClasses, f as generateUtilityClass } from "./identifier-Blietev0.js";
import { n as styled, t as useDefaultProps } from "./DefaultPropsProvider-BRzJ905B.js";
//#region node_modules/@mui/material/esm/CardContent/cardContentClasses.js
var import_prop_types = /* @__PURE__ */ __toESM(require_prop_types(), 1);
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function getCardContentUtilityClass(slot) {
	return generateUtilityClass("MuiCardContent", slot);
}
var cardContentClasses = generateUtilityClasses("MuiCardContent", ["root"]);
//#endregion
//#region node_modules/@mui/material/esm/CardContent/CardContent.js
var import_jsx_runtime = require_jsx_runtime();
var useUtilityClasses = (ownerState) => {
	const { classes } = ownerState;
	return composeClasses({ root: ["root"] }, getCardContentUtilityClass, classes);
};
var CardContentRoot = styled("div", {
	name: "MuiCardContent",
	slot: "Root"
})({
	padding: 16,
	"&:last-child": { paddingBottom: 24 }
});
var CardContent = /* @__PURE__ */ import_react.forwardRef(function CardContent(inProps, ref) {
	const props = useDefaultProps({
		props: inProps,
		name: "MuiCardContent"
	});
	const { className, component = "div", ...other } = props;
	const ownerState = {
		...props,
		component
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContentRoot, {
		as: component,
		className: clsx(useUtilityClasses(ownerState).root, className),
		ownerState,
		ref,
		...other
	});
});
CardContent.propTypes = {
	children: import_prop_types.default.node,
	classes: import_prop_types.default.object,
	className: import_prop_types.default.string,
	component: import_prop_types.default.elementType,
	sx: import_prop_types.default.oneOfType([
		import_prop_types.default.arrayOf(import_prop_types.default.oneOfType([
			import_prop_types.default.func,
			import_prop_types.default.object,
			import_prop_types.default.bool
		])),
		import_prop_types.default.func,
		import_prop_types.default.object
	])
};
//#endregion
export { cardContentClasses, CardContent as default, getCardContentUtilityClass };

//# sourceMappingURL=@mui_material_CardContent.js.map