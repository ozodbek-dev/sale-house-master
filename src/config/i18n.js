import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import uz_kr from "locales/uz_kr.json"
import ru from "locales/ru.json"
import uz from "locales/uz.json"
i18n.use(initReactI18next).init({
	resources: {
		uz_kr: {
			translation: uz_kr
		},
		ru: {
			translation: ru
		},
		uz: {
			translation: uz
		}
	},
	lng: localStorage.getItem("lang") || "uz"
})

export default i18n
