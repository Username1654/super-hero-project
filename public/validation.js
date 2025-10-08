document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrationForm');
  const validationState = {};
  const inputs = form.querySelectorAll('input[pattern]');

  function setErrorMessage(fieldName, value, errorElement) {
    let errorMessage = '';

    switch (fieldName) {
      case 'firstName':
        if (value.length === 0) {
          errorMessage = 'First name is required';
        } else if (value.length > 50) {
          errorMessage = 'First name must be less than 50 characters';
        } else if (value.length < 2) {
          errorMessage = 'First name must be 2 or more characters';
        } else {
          errorMessage = 'First name must only include letters';
        }
        break;

      case 'email':
        if (value.length === 0) {
          errorMessage = 'Email address is required';
        } else {
          errorMessage = 'Please enter a valid email address';
        }
        break;

      case 'phone':
        if (value.length === 0) {
          errorMessage = 'Phone number is required';
        } else {
          errorMessage =
            'Please enter a valid phone number (format: 123-456-7890)';
        }
        break;

      default:
        errorMessage = `Invalid ${fieldName}`;
    }
    errorElement.textContent = errorMessage;
  }
  function validateInput(input) {
    const fieldName = input.name;
    const value = input.value;
    const pattern = new RegExp(input.pattern);
    const isValid = pattern.test(value);
    const errorElement = document.getElementById(`${fieldName}Error`);
    console.log(`${fieldName} validation:`, isValid);

    if (isValid) {
      input.classList.add('is-valid');
      input.classList.remove('is-invalid');
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
    }
    // add error message function
    validationState[fieldName] = isValid;
    console.log(validationState);
    setErrorMessage(fieldName, value, errorElement);
  }

  inputs.forEach((input) => {
    const fieldName = input.name;
    validationState[fieldName] = false;
    validateInput(input);
    input.addEventListener('input', function () {
      validateInput(this);
    });
  });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const requiredFields = document.querySelectorAll('input[required]');
    const isFormValid = [...requiredFields].every((input) => {
      const value = formData.get(input.name);
      return value && validationState[input.name];
    });
    if (!isFormValid) {
      console.log(
        'form invalid - missing required fields or validation failed'
      );
      return;
    }
    // Collect all form data
    const submitData = {};
    for (const [key, value] of formData.entries()) {
      if (value.trim()) {
        // Only include non-empty values
        submitData[key] = value.trim();
      }
    }
    console.log('Submitting:', submitData);
    async function postNewForm() {
      return fetch('/form/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });
    }

    try {
      const response = await postNewForm();
      if (!response.ok) {
        throw new Error('problem with response');
      }
      const data = await response.json();
      console.log('data received from server', data);
      if (data.success && data.redirectTo) {
        window.location.replace(data.redirectTo);
      }
    } catch (err) {
      console.log('There was a problem', err);
    }
  });
});
