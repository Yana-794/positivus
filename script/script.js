class FormValidation{
    selectors = {
        form: '[data-js-form]',
        fieldErrors: '[data-js-form-field-errors]'
    }

    errorMessages = {
        valueMissing: () => 'Пожалуйста, заполните это поле',
        patternMismatch: ({title}) => title || 'Данные не соответствут форме',
        tooShort: ({minLength}) => `Слишком короткое сообщение, минимум символов ${minLength}`,
    }

    constructor(){
        this.bindEvents() //обработчик событий
    }
//собирает ошибки для заданного поля и управляет отображением ошибок
    manageErrors(fieldControlElement, errorMessages){
        const fieldErrorsElement = fieldControlElement.parentElement.queriSelector(this.selectors.fieldErrors)
        
        fieldErrorsElement.innerHTML = errorMessages
        .map((message) => `<span class"field__error">${message}</span>`)
        .join('')
    }

    validatteField(fieldControlElement){
        const errors = fieldControlElement.validity
        const errorMessages =[]

        Object.entries(this.errorMessages).forEach(([errorType, getErrorMassage]) => {
            if (errors[errorType]){
                errorMessages.push(getErrorMassage(fieldControlElement))
            }
        })

        this.manageErrors(fieldControlElement, errorMessages)
            const isValid = errorMessages.length === 0
            fieldControlElement.ariaInvalid = !isValid

            return isValid

    }

    onChange(event){
        const {target} = event
        const isRequired = target.required 
        const isToggleType = ['radio', 'checkbox'].includes(target.type)

        if (isToggleType && isRequired){
            this.validatteField(target)
        }

        
    }

    onBlur(event){
        const {target} = event
        const isFormField = target.closest(this.selectors.form)
        const isRequired = target.required

        if (isFormField && isRequired){
            this.validatteField(target)
        }

    }

    onSubmit(event){
        const isFormElement = event.target.matches(this.selectors.form)
        if(!isFormElement){
            return
        }

        const requiredControlElements = [...event.target.elements].filter(({required}) => required)

        let isFormValid = true
        let firstItvalidFieldControl = null

        requiredControlElements.forEach((element) => {
            const isFieldValid = this.validatteField(element)

            if(!isFieldValid){
                isFormValid = false

                if(!firstItvalidFieldControl){
                    firstItvalidFieldControl = element
                }
            }

        })

        if(!isFormValid){
            event.prevntDefault()
            firstItvalidFieldControl.focus()
        }
    }


bindEvents(){
    document.addEventListener('blur', (event) => {
        this.onBlur(event)
    },{capture: true}
)
document.addEventListener('change', (event) => this.onChange(event))
document.addEventListener('submit', (event) => this.onSubmit(event))
}
    



}


new FormValidation 