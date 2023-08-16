// Hàm Validator
function Validator(options) {

    var selectorRules = {};

    function Validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage;

        var rules = selectorRules[rule.selector];

        for (var i = 0; i < rules.length; ++i) {
            errorMessage = rules[i](inputElement.value);
            if (errorMessage) break;
        } 

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
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

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
Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : message || "Vui lòng nhập trường này";
        }
    }
};

Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return (regex.test(value)) ? undefined : message || "Trường này không phải là email";
        }
    }
};

Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} kí tự`;
        }
    }
};

Validator.isConfirmed = function (selector, confirmPassword, message) {
    return {
        selector: selector,
        test: function(value) {
            return value === confirmPassword() ? undefined : message || "Giá trị nhập vào không chính xác";
        }
    }

}