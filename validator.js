// Hàm Validator
function Validator(options) {

    function Validate(inputElement, rule) {
        var errorMessage = rule.test(inputElement.value);
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector)

        if (errorMessage) {
            errorElement.innerText = errorMessage;

            errorElement.parentElement.classList.add("invalid");
        } else {
            errorElement.innerText = "";
            errorElement.parentElement.classList.remove("invalid");
        }
    }

    var formElement = document.querySelector(options.form);

    if (formElement) {
        
        options.rules.forEach(function (rule) {
            var inputElement = formElement.querySelector(rule.selector);

            if (inputElement) {
                // Xử lí khi người dùng bấm ra ngoài (blur)
                inputElement.onblur = function() {
                    Validate(inputElement, rule)
                } 

                // Xử lí khi người dùng nhập vào input
                inputElement.oninput = function () {
                    var errorElement = inputElement.parentElement.querySelector(".form-message")
                    errorElement.innerText = "";
                    errorElement.parentElement.classList.remove("invalid");
                }
            }
        })


    }
}

// Định nghĩa rules
// Nguyên tắc của các rule:
// 1. Khi có lỗi --> trả ra message lỗi
// 2. Khi hợp lệ --> ko trả ra gì cả (undefined)
Validator.isRequired = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : "Vui lòng nhập trường này";
        }
    }
};

Validator.isEmail = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return (regex.test(value)) ? undefined : "Trường này không phải là email";
        }
    }
};

Validator.minLength = function (selector, min) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự`;
        }
    }
};