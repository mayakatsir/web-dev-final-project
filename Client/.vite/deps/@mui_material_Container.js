import { r as __toESM } from "./react-TUYU05Ph.js";
import { D as require_prop_types, d as generateUtilityClasses, f as generateUtilityClass, i as createContainer } from "./identifier-Blietev0.js";
import { n as styled, t as useDefaultProps } from "./DefaultPropsProvider-BRzJ905B.js";
import { t as capitalize_default } from "./capitalize-eCJtuew8.js";
//#region node_modules/@mui/material/esm/Container/Container.js
var import_prop_types = /* @__PURE__ */ __toESM(require_prop_types(), 1);
var Container = createContainer({
	createStyledComponent: styled("div", {
		name: "MuiContainer",
		slot: "Root",
		overridesResolver: (props, styles) => {
			const { ownerState } = props;
			return [
				styles.root,
				styles[`maxWidth${capitalize_default(String(ownerState.maxWidth))}`],
				ownerState.fixed && styles.fixed,
				ownerState.disableGutters && styles.disableGutters
			];
		}
	}),
	useThemeProps: (inProps) => useDefaultProps({
		props: inProps,
		name: "MuiContainer"
	})
});
Container.propTypes = {
	children: import_prop_types.default.node,
	classes: import_prop_types.default.object,
	component: import_prop_types.default.elementType,
	disableGutters: import_prop_types.default.bool,
	fixed: import_prop_types.default.bool,
	maxWidth: import_prop_types.default.oneOfType([import_prop_types.default.oneOf([
		"xs",
		"sm",
		"md",
		"lg",
		"xl",
		false
	]), import_prop_types.default.string]),
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
//#region node_modules/@mui/material/esm/Container/containerClasses.js
function getContainerUtilityClass(slot) {
	return generateUtilityClass("MuiContainer", slot);
}
var containerClasses = generateUtilityClasses("MuiContainer", [
	"root",
	"disableGutters",
	"fixed",
	"maxWidthXs",
	"maxWidthSm",
	"maxWidthMd",
	"maxWidthLg",
	"maxWidthXl"
]);
//#endregion
export { containerClasses, Container as default, getContainerUtilityClass };

//# sourceMappingURL=@mui_material_Container.js.map