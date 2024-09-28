import { colors, colorSeparators } from "shared/colors"

export const lightMode = {
	palette: {
		type: "light",
		primary: {
			main: colors.baseColor,
			contrastText: colors.whiteColor
		},
		secondary: {
			main: colors.baseColorLight,
			contrastText: colors.whiteColor
		},
		formColor: {
			main: colors.formColor
		}
	},
	typography: {
		fontFamily: '"Inter", sans-serif'
	},
	components: {
		MuiButtonBase: {
			styleOverrides: {
				root: {
					borderRadius: "8px",
					zIndex: "1 !important"
				}
			}
		},
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: "8px",
					zIndex: "1 !important",
					textTransform: "inherit"
				},
				language: {
					minWidth: "auto",
					width: "auto !important"
				}
			},
			variants: [
				{
					props: { variant: "filterOutlined" },
					style: {
						height: "40px",
						backgroundColor: `rgba(${colorSeparators.baseColorLight}, 0.15)`,
						border: `1px solid  ${colors.baseColor}`,
						color: colors.baseColor,
						"&:hover": {
							transition: "all 0.25s",
							background: `linear-gradient(to bottom right, ${colors.baseColor}, ${colors.baseColorLight})`,
							color: colors.whiteColor
						}
					}
				},
				{
					props: { variant: "filterContained" },
					style: {
						height: "40px",
						backgroundColor: colors.baseColor,
						border: `1px solid  ${colors.baseColor}`,
						color: colors.whiteColor,
						"&:hover": {
							transition: "all 0.25s",
							backgroundColor: colors.baseColor,
							color: colors.whiteColor
						}
					}
				},
				{
					props: { variant: "form", color: "primary" },
					style: {
						height: "40px",
						backgroundColor: `rgba(${colorSeparators.baseColorLight}, 0.15)`,
						border: `1px solid  ${colors.baseColor}`,
						color: colors.baseColor,
						"&:hover": {
							transition: "all 0.25s",
							backgroundColor: colors.baseColor,
							color: colors.whiteColor
						}
					}
				},
				{
					props: { variant: "formContained", color: "primary" },
					style: {
						height: "40px",
						backgroundColor: colors.baseColor,
						border: `1px solid  ${colors.baseColor}`,
						color: colors.whiteColor,
						"&:hover": {
							transition: "all 0.25s",
							backgroundColor: colors.baseColor,
							color: colors.whiteColor
						}
					}
				},
				{
					props: { variant: "upload", color: "primary" },
					style: {
						height: "40px",
						backgroundColor: `rgba(${colorSeparators.baseColorLight}, 0.15)`,
						border: `1px solid  ${colors.baseColor}`,
						color: colors.baseColor,
						"&:hover": {
							transition: "all 0.25s",
							backgroundColor: colors.baseColor,
							color: colors.whiteColor
						}
					}
				},
				{
					props: { variant: "action" },
					style: {
						borderRadius: "8px",
						width: "32px",
						height: "32px",
						minWidth: "32px",
						"& i": {
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: "1.1rem"
						}
					}
				},
				{
					props: { variant: "action", color: "info" },
					style: {
						backgroundColor: `rgba(${colorSeparators.infoColor}, 0.15)`,
						color: colors.infoColor,
						"&:hover": {
							backgroundColor: colors.infoColor,
							color: colors.whiteColor,
							boxShadow: `0 0 #0000, 0 0 #0000, 0 0 10px 1px rgba(${colorSeparators.infoColor}, 0.35)`
						}
					}
				},
				{
					props: { variant: "action", color: "success" },
					style: {
						backgroundColor: `rgba(${colorSeparators.successColor}, 0.15)`,
						color: colors.successColor,
						"&:hover": {
							backgroundColor: colors.successColor,
							color: colors.whiteColor,
							boxShadow: `0 0 #0000, 0 0 #0000, 0 0 10px 1px rgba(${colorSeparators.successColor}, 0.35)`
						}
					}
				},
				{
					props: { variant: "action", color: "default" },
					style: {
						backgroundColor: `rgba(${colorSeparators.blackColor}, 0.15)`,
						color: colors.blackColor,
						"&:hover": {
							backgroundColor: `rgba(${colorSeparators.blackColor}, 0.5)`,
							color: colors.whiteColor,
							boxShadow: `0 0 #0000, 0 0 #0000, 0 0 10px 1px rgba(${colorSeparators.blackColor}, 0.35)`
						}
					}
				},
				{
					props: { variant: "action", color: "primary" },
					style: {
						backgroundColor: `rgba(${colorSeparators.baseColorLight}, 0.15)`,
						color: colors.baseColor,
						"&:hover": {
							backgroundColor: colors.baseColor,
							color: colors.whiteColor
						}
					}
				},
				{
					props: { variant: "action", color: "secondary" },
					style: {
						backgroundColor: `rgba(${colorSeparators.baseColorLight}, 0.15)`,
						color: colors.baseColorLight,
						"&:hover": {
							backgroundColor: colors.baseColorLight,
							color: colors.whiteColor
						}
					}
				},
				{
					props: { variant: "action", color: "warning" },
					style: {
						backgroundColor: `rgba(${colorSeparators.warningColor}, 0.15)`,
						color: colors.warningColor,
						"&:hover": {
							backgroundColor: colors.warningColor,
							color: colors.whiteColor
						}
					}
				},
				{
					props: { variant: "actionLarge" },
					style: {
						borderRadius: "8px",
						width: "40px",
						height: "40px",
						minWidth: "40px",
						"& i": {
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: "1.3rem"
						}
					}
				},
				{
					props: { variant: "actionLargeOutlined" },
					style: {
						borderRadius: "8px",
						width: "40px",
						height: "40px",
						minWidth: "40px",
						"& i": {
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: "1.3rem"
						}
					}
				},
				{
					props: { variant: "actionLarge", color: "info" },
					style: {
						backgroundColor: `rgba(${colorSeparators.infoColor}, 0.15)`,
						color: colors.infoColor,
						"&:hover": {
							backgroundColor: colors.infoColor,
							color: colors.whiteColor,
							boxShadow: `0 0 #0000, 0 0 #0000, 0 0 10px 1px rgba(${colorSeparators.infoColor}, 0.35)`
						}
					}
				},
				{
					props: { variant: "actionLarge", color: "success" },
					style: {
						backgroundColor: `rgba(${colorSeparators.successColor}, 0.15)`,
						color: colors.successColor,
						"&:hover": {
							backgroundColor: colors.successColor,
							color: colors.whiteColor,
							boxShadow: `0 0 #0000, 0 0 #0000, 0 0 10px 1px rgba(${colorSeparators.successColor}, 0.35)`
						}
					}
				},
				{
					props: { variant: "actionLarge", color: "default" },
					style: {
						backgroundColor: `rgba(${colorSeparators.blackColor}, 0.15)`,
						color: colors.blackColor,
						"&:hover": {
							backgroundColor: `rgba(${colorSeparators.blackColor}, 0.5)`,
							color: colors.whiteColor,
							boxShadow: `0 0 #0000, 0 0 #0000, 0 0 10px 1px rgba(${colorSeparators.blackColor}, 0.35)`
						}
					}
				},
				{
					props: { variant: "actionLarge", color: "primary" },
					style: {
						backgroundColor: `rgba(${colorSeparators.baseColorLight}, 0.15)`,
						color: colors.baseColor,
						"&:hover": {
							backgroundColor: colors.baseColor,
							color: colors.whiteColor
						}
					}
				},
				{
					props: { variant: "actionLarge", color: "warning" },
					style: {
						backgroundColor: `rgba(${colorSeparators.warningColor}, 0.15)`,
						color: colors.warningColor,
						"&:hover": {
							backgroundColor: colors.warningColor,
							color: colors.whiteColor
						}
					}
				},
				{
					props: { variant: "actionLargeOutlined", color: "warning" },
					style: {
						backgroundColor: colors.warningColor,
						color: colors.whiteColor,
						"&:hover": {
							backgroundColor: `rgba(${colorSeparators.warningColor}, 1)`
						}
					}
				},
				{
					props: { variant: "uploadOnlyIcon" },
					style: {
						borderRadius: "8px",
						width: "40px",
						height: "40px",
						minWidth: "40px",
						"& i": {
							fontSize: "1.3rem"
						}
					}
				},
				{
					props: { variant: "uploadOnlyIcon", color: "primary" },
					style: {
						backgroundColor: `rgba(${colorSeparators.baseColorLight}, 0.15)`,
						color: colors.baseColor,
						"&:hover": {
							backgroundColor: colors.baseColor,
							color: colors.whiteColor
						}
					}
				},
				{
					props: { variant: "notification" },
					style: {
						borderRadius: "8px",
						width: "40px",
						height: "40px",
						minWidth: "40px",
						"& i": {
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: "1.1rem"
						},
						backgroundColor: `rgba(${colorSeparators.baseColorLight}, 0.15)`,
						color: colors.baseColor,
						"&:hover": {
							backgroundColor: colors.baseColor,
							color: colors.whiteColor
						}
					}
				},
				{
					props: { variant: "language" },
					style: {
						height: "40px",
						backgroundColor: `rgba(${colorSeparators.baseColorLight}, 0.15)`,
						color: colors.baseColor,
						fontSize: "1rem",
						lineHeight: "1rem",
						fontWeight: "normal",
						"&:hover": {
							transition: "all 0.25s",
							background: colors.baseColor,
							color: colors.whiteColor
						}
					}
				},
				{
					props: { disable: "true" },
					style: {
						color: `rgba(${colorSeparators.footerColor}, 0.5)`,
						borderColor: `rgba(${colorSeparators.footerColor}, 0.3)`,
						userSelect: "none",
						pointerEvents: "none"
					}
				}
			]
		},
		MuiIconButton: {
			variants: [
				{
					props: { variant: "onlyIcon" },
					style: {
						borderRadius: "50%",
						color: colors.baseColor,
						width: "32px",
						height: "32px",
						minWidth: "32px",
						fontSize: "1.8rem",
						"& span": {
							fontSize: "1.5rem",
							fontWeight: "bolder"
						}
					}
				},
				{
					props: { variant: "toggle" },
					style: {
						backgroundColor: colors.whiteColor,
						boxShadow: `0 0 #0000, 0 0 #0000, 0 0 10px 1px ${colors.shadowColor}`,
						width: "32px",
						height: "32px",
						minWidth: "32px",
						i: {
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: "20px",
							lineHeight: "20px",
							color: colors.baseColor
						},
						"&:hover": {
							backgroundColor: colors.baseColor,
							i: {
								color: colors.whiteColor
							}
						}
					}
				}
			]
		},
		MuiFab: {
			variants: [
				{
					props: { variant: "action" },
					style: {
						borderRadius: "100%",
						width: "36px",
						height: "36px",
						minWidth: "36px",
						margin: "2px 4px",
						"&:hover": {
							backgroundColor: colors.baseColor,
							color: colors.whiteColor
						},
						i: {
							fontSize: "1rem",
							display: "flex",
							alignItems: "center",
							justifyContent: "center"
						}
					}
				},
				{
					props: { variant: "action", color: "error" },
					style: {
						backgroundColor: `rgba(${colorSeparators.errorColor}, 0.15)`,
						color: colors.errorColor,
						boxShadow: `0 0 #0000, 0 0 #0000, 0 0 5px 1px ${colors.shadowColor}`,
						border: `1px solid  ${colors.errorColor}`,
						"&:hover": {
							backgroundColor: colors.errorColor,
							color: colors.whiteColor
						}
					}
				},
				{
					props: { variant: "action", color: "warning" },
					style: {
						backgroundColor: `rgba(${colorSeparators.warningColor}, 0.15)`,
						color: colors.warningColor,
						boxShadow: `0 0 #0000, 0 0 #0000, 0 0 5px 1px rgba(${colorSeparators.warningColor}, 0.15)`,
						border: `1px solid  ${colors.warningColor}`,
						"&:hover": {
							backgroundColor: colors.warningColor,
							color: colors.whiteColor
						}
					}
				},
				{
					props: { variant: "action", color: "info" },
					style: {
						backgroundColor: `rgba(${colorSeparators.infoColor}, 0.15)`,
						color: colors.infoColor,
						boxShadow: `0 0 #0000, 0 0 #0000, 0 0 5px 1px rgba(${colorSeparators.infoColor}, 0.15)`,
						border: `1px solid  ${colors.infoColor}`,
						"&:hover": {
							backgroundColor: colors.infoColor,
							color: colors.whiteColor
						}
					}
				},
				{
					props: { variant: "action", color: "success" },
					style: {
						backgroundColor: `rgba(${colorSeparators.successColor}, 0.15)`,
						color: colors.successColor,
						boxShadow: `0 0 #0000, 0 0 #0000, 0 0 5px 1px rgba(${colorSeparators.successColor}, 0.15)`,
						border: `1px solid  ${colors.successColor}`,
						"&:hover": {
							backgroundColor: colors.successColor,
							color: colors.whiteColor
						}
					}
				}
			]
		},
		MuiAvatar: {
			styleOverrides: {
				root: {}
			}
		},
		MuiMenu: {
			styleOverrides: {
				paper: {
					filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
					marginTop: "1rem",
					borderRadius: "8px",
					"&::-webkit-scrollbar": {
						width: "6px",
						height: "6px"
					},
					"&::-webkit-scrollbar-thumb": {
						borderRadius: "4px",
						backgroundColor: colors.baseColorLight,
						"&:hover": {
							backgroundColor: colors.baseColor
						}
					},
					"&::-webkit-scrollbar-track": {
						borderRadius: "4px",
						backgroundColor: colors.whiteColor
					}
				}
			}
		},
		MuiInputBase: {
			styleOverrides: {
				root: {
					borderRadius: "8px !important",
					height: "40px",
					fontSize: "0.875rem",
					"&.MuiInputBase-sizeSmall": {
						height: "36px",
						fontSize: "0.8rem",
						".MuiInputAdornment-root .MuiSvgIcon-root": {
							width: "0.8em",
							height: "0.8em"
						}
					}
				},
				multiline: {
					paddingTop: "0.55rem",
					paddingBottom: "0.55rem",
					height: "inherit"
				},
				input: {
					paddingTop: "0.55rem",
					paddingBottom: "0.55rem"
				},
				inputMultiline: {
					paddingTop: "0px !important",
					paddingBottom: "0px !important"
				},
				adornedEnd: {
					"&:has(.MuiInputAdornment-root.custom-endAdornment)": {
						paddingRight: "0px !important"
					}
				}
			},
			variants: [
				{
					props: { variant: "filterField" },
					style: {
						height: "inherit",
						minHeight: "40px"
					}
				}
			]
		},
		MuiSelect: {
			styleOverrides: {
				root: {
					borderRadius: "8px !important",
					fontSize: "0.875rem"
				},
				multiple: {
					paddingTop: "0.55rem",
					paddingBottom: "0.55rem",
					height: "inherit !important"
				},
				input: {
					paddingTop: "0.55rem",
					paddingBottom: "0.55rem"
				},
				inputMultiline: {
					paddingTop: "0px !important",
					paddingBottom: "0px !important"
				}
			}
		},
		MuiFormHelperText: {
			styleOverrides: {
				root: {
					marginLeft: "0",
					lineHeight: "1.2rem"
				}
			}
		},
		MuiInputLabel: {
			styleOverrides: {
				root: {
					top: "-6px",
					lineHeight: "1.2rem",
					fontSize: "0.875rem",
					"&.MuiFormLabel-filled, &.Mui-focused": {
						top: "0px"
					}
				}
			}
		},
		MuiFormControl: {
			styleOverrides: {
				root: {
					marginTop: "0.5rem",
					marginBottom: "0.5rem"
				}
			},
			variants: [
				{
					props: { type: "checkbox", color: "formColor" },
					style: {
						height: "40px",
						borderRadius: "8px",
						paddingLeft: "0.5rem",
						fontSize: "0.875rem",
						backgroundColor: `rgba(${colorSeparators.baseColorLight}, 0.15)`,
						transition: "all 250ms",
						color: colors.baseColor,
						border: `1px solid  ${colors.baseColor}`,
						".MuiSvgIcon-root": {
							color: colors.baseColor,
							width: "0.9em",
							height: "0.9em"
						},
						"&:hover": {
							backgroundColor: colors.baseColor,
							color: colors.whiteColor,
							".MuiSvgIcon-root": {
								color: colors.whiteColor
							}
						},
						"&:has(.MuiFormControlLabel-root.Mui-disabled)": {
							height: "40px",
							borderRadius: "8px",
							paddingLeft: "0.5rem",
							fontSize: "0.875rem",
							backgroundColor: `rgba(${colorSeparators.blackColor}, 0.05)`,
							transition: "all 250ms",
							color: colors.baseColor,
							border: `1px solid  rgba(${colorSeparators.blackColor}, 0.4)`,
							".MuiSvgIcon-root": {
								color: `rgba(${colorSeparators.baseColor}, 0.3)`,
								width: "0.9em",
								height: "0.9em"
							},
							"&:hover": {
								backgroundColor: `rgba(${colorSeparators.blackColor}, 0.05)`,
								color: "initial",
								".MuiSvgIcon-root": {
									color: `rgba(${colorSeparators.baseColor}, 0.3)`
								}
							}
						}
					}
				},
				{
					props: { type: "radiogroup", color: "formColor" },
					style: {
						".MuiSvgIcon-root": {
							width: "0.9em",
							height: "0.9em"
						}
					}
				}
			]
		},
		MuiOutlinedInput: {
			styleOverrides: {
				input: {
					paddingTop: "0.55rem",
					paddingBottom: "0.55rem"
				}
			}
		},
		MuiAutocomplete: {
			styleOverrides: {
				inputRoot: {
					padding: "0.25rem !important"
				},
				input: {
					paddingTop: "0.5rem !important",
					paddingBottom: "0.5rem !important"
				},
				listbox: {
					"&::-webkit-scrollbar": {
						width: "8px",
						height: "6px"
					},
					"&::-webkit-scrollbar-thumb": {
						borderRadius: "4px",
						backgroundColor: colors.baseColorLight,
						"&:hover": {
							backgroundColor: colors.baseColor
						}
					},
					"&::-webkit-scrollbar-track": {
						borderRadius: "4px",
						backgroundColor: colors.whiteColor
					}
				}
			}
		},
		MuiBadge: {
			styleOverrides: {
				dot: {
					top: "5px"
				}
			}
		},
		MuiAccordionSummary: {
			styleOverrides: {
				root: {
					paddingLeft: "0",
					paddingRight: "0",
					margin: "0",
					minHeight: "40px",
					"&.Mui-expanded": { minHeight: "40px" }
				},
				content: {
					margin: "0",
					alignItems: "center",
					"&.Mui-expanded": { margin: "0" }
				},
				expandIconWrapper: {
					"&.Mui-expanded": {
						transform: "rotate(90deg)"
					}
				}
			}
		},
		MuiMenuItem: {
			styleOverrides: {
				root: {
					borderRadius: "0px",
					"&:hover, &:active, &:focus": {
						backgroundColor: `rgba(${colorSeparators.baseColorLight}, 0.15)`
					}
				}
			}
		},
		MuiTouchRipple: {
			styleOverrides: {}
		},
		MuiTable: {
			styleOverrides: {
				root: {}
			}
		},
		MuiTableContainer: {
			styleOverrides: {
				root: {
					boxShadow: `0 0 #0000, 0 0 #0000, 0 0 5px 1px ${colors.shadowColor}`,
					borderRadius: "8px",
					"&::-webkit-scrollbar": {
						width: "6px",
						height: "8px"
					},
					"&::-webkit-scrollbar-thumb": {
						backgroundColor: colors.baseColorLight,
						borderRadius: "4px"
					},
					"&::-webkit-scrollbar-thumb:hover": {
						background: colors.baseColor
					},
					"&::-webkit-scrollbar-track": {
						borderRadius: "4px",
						background: colors.whiteColor
					}
				}
			}
		},
		MuiTableHead: {
			styleOverrides: {
				root: {}
			}
		},
		MuiTableCell: {
			styleOverrides: {
				root: {
					fontWeight: 500,
					fontSize: "0.85rem",
					lineHeight: "1.2"
				},
				head: {
					fontWeight: 700,
					lineHeight: "1.2"
				}
			}
		},
		MuiTableRow: {
			styleOverrides: {
				root: {}
			}
		},
		MuiTablePagination: {
			styleOverrides: {
				selectLabel: { fontSize: "1rem" },
				displayedRows: { fontSize: "1rem" },
				select: { fontSize: "1rem" }
			}
		},
		MuiChip: {
			variants: [
				{
					props: { variant: "tableBadge" },
					style: {
						borderRadius: "8px",
						fontSize: "0.75rem",
						height: "30px"
					}
				}
			]
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					boxShadow: `0 0 #0000, 0 0 #0000, 0 0 10px 1px ${colors.shadowColor}`
				}
			}
		},
		MuiTooltip: {
			styleOverrides: {
				tooltip: {
					marginBottom: "20px !important",
					fontSize: 11
				}
			}
		},
		MuiDialogContent: {
			styleOverrides: {
				root: {
					"&::-webkit-scrollbar": {
						width: "8px",
						height: "6px"
					},
					"&::-webkit-scrollbar-thumb": {
						borderRadius: "4px",
						backgroundColor: colors.baseColorLight,
						"&:hover": {
							backgroundColor: colors.baseColor
						}
					},
					"&::-webkit-scrollbar-track": {
						borderRadius: "4px",
						backgroundColor: colors.whiteColor
					}
				}
			}
		},
		MuiStepConnector: {
			styleOverrides: {
				root: {
					top: "20px",
					"&.Mui-completed .MuiStepConnector-line, &.Mui-active .MuiStepConnector-line":
						{
							borderColor: colors.baseColor
						},
					zIndex: 1
				},
				line: {
					borderTopWidth: "3px",
					borderColor: colors.base2
				}
			}
		},
		MuiStepLabel: {
			styleOverrides: {
				iconContainer: {
					zIndex: 5
				},
				label: {
					"&.MuiStepLabel-alternativeLabel": {
						marginTop: 0
					}
				}
			}
		},
		MuiFormLabel: {
			styleOverrides: {
				root: {
					fontSize: "0.875rem"
				}
			}
		},
		MuiFormControlLabel: {
			styleOverrides: {
				label: {
					fontSize: "0.875rem"
				}
			}
		},
		MuiToggleButtonGroup: {
			styleOverrides: {
				root: {
					boxShadow: `0 0 #0000, 0 0 #0000, 0 0 5px 1px ${colors.shadowColor}`,
					border: `1px solid rgba(${colorSeparators.baseColorLight}, 0.15)`,
					borderRadius: "8px"
				},
				grouped: {
					margin: "6px",
					border: 0,
					backgroundColor: `rgba(${colorSeparators.blackColor}, 0.05)`,
					"&.Mui-selected": {
						backgroundColor: `rgba(${colorSeparators.baseColor}, 0.9)`,
						color: colors.whiteColor,
						"&:hover": {
							backgroundColor: colors.baseColor
						}
					},
					"&:hover": {
						backgroundColor: `rgba(${colorSeparators.baseColor}, 0.15)`
					},
					"&.Mui-disabled": {
						backgroundColor: `rgba(${colorSeparators.blackColor}, 0.05)`,
						border: `1px solid  rgba(${colorSeparators.blackColor}, 0.4)`
					},
					"&:not(:first-of-type)": {
						borderRadius: "8px"
					},
					"&:first-of-type": {
						borderRadius: "8px"
					}
				}
			}
		}
		/* styleOverrides: {
			root: {}
		} */
	}
}
