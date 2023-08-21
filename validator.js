const submitBtn = document.querySelector(".form-submit");
submitBtn.onclick = function() {
    submitBtn.classList.add("submit-btn");
    
    setTimeout(function() {
        submitBtn.classList.remove("submit-btn");
    }, 50);
}

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

        return !errorMessage;
    }

    var formElement = document.querySelector(options.form);

    if (formElement) {

        // Khi submit form
        formElement.onsubmit = function(e) {
            e.preventDefault();

            var isFormValid = true;

            // Lặp qua từng rule và validate
            options.rules.forEach(function(rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = Validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                if (typeof options.onSubmit === "function") {
                    
                    var enableInputs = formElement.querySelectorAll("[name]");

                    var formValues = Array.from(enableInputs).reduce(function (values, input) {
                        return (values[input.name] = input.value) && values
                    }, {});

                    options.onSubmit (formValues);
                };
            }
        }
        
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
                    Validate(inputElement, rule);
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