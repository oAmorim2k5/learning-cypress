import assert from 'assert'

const baseUrl = "https://erickwendel.github.io/vanilla-js-web-app-example/"

class RegisterForm {
  elements = {
    titleInput: () => cy.get('#title'),
    titleFeedback: () => cy.get('#titleFeedback'),
    imageUrlInput: () => cy.get('#imageUrl'),
    urlFeedback: () => cy.get('#urlFeedback'),
    submitBtn: () => cy.get('#btnSubmit'),
  }

  typeTitle(text) {
    if(!text) return;
    this.elements.titleInput().type(text)
  }

  typeUrl(text) {
    if(!text) return;
    this.elements.imageUrlInput().type(text)
  }

  clickSubmit() {
    this.elements.submitBtn().click()
  }
}

const registerForm = new RegisterForm
const colors = {
  errors: 'rgb(220, 53, 69)',
  success: 'rgb(25, 135, 84)'
}
const input = {
      title: 'Alien BR',
      url: 'https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg'
}
let urls = []

describe('Image Registration', () => {
  describe('Submitting an image with invalid inputs', () => {
    after(() => {
      cy.clearAllLocalStorage()
    })
    const input = {
      title: '',
      url: ''
    }
    it('Given I am on the image registration page', () => {
      cy.visit(baseUrl)
    })

    it(`When I enter "${input.title}" in the title field`, () => {
      registerForm.typeTitle(input.title)
    })

    it(`Then I enter "${input.url}" in the URL field`, () => {
      registerForm.typeUrl(input.url)
    })

    it('Then I click the submit button', () => {
      registerForm.clickSubmit()
    })
    it('Then I should see "Please type a title for the image" message above the title field', () => {
      registerForm.elements.titleFeedback().should('contains.text', 'Please type a title for the image')
    })
    it('And I should see "Please type a valid URL" message above the imageUrl field', () => {
      registerForm.elements.urlFeedback().should('contain.text', 'Please type a valid URL')
    })
    it('And I should see an exclamation icon in the title and URL fields', () => {
      registerForm.elements.titleInput().should(([element]) => {
        const styles = window.getComputedStyle(element)
        const border = styles.getPropertyValue('border-right-color')
        assert.strictEqual(border, colors.errors)
      })
    })


  }) 
  describe('Submitting an image with valid inputs using enter key', () => {
    after(() => {
      cy.clearAllLocalStorage()
    })

    it('Given I am on the image registration page', () => {
      cy.visit(baseUrl)
    })

    it(`When I enter ${input.title} in the title field`, () => {
      registerForm.typeTitle(`${input.title}{enter}`)
    })

    it('Then I should see a check icon in the title field', () => {
      registerForm.elements.titleInput().should(([element]) => {
        const styles = window.getComputedStyle(element)
        const border = styles.getPropertyValue('border-right-color')
        assert.strictEqual(border, colors.success)
      })
    })

    it(`When I enter "${input.url}" in the URL field`, () => {
      registerForm.typeUrl(`${input.url}`)
    })

    it("Then I should see a check icon in the imageUrl field", () => {
      registerForm.elements.imageUrlInput().should(([element]) => {
        const styles = window.getComputedStyle(element)
        const border = styles.getPropertyValue('border-right-color')
        assert.strictEqual(border, colors.success)
      })
    })

    it("Then I can hit enter to submit the form", () => {
      registerForm.elements.submitBtn().click()
    })

    it("And the list of registered images should be updated with the new item", () => {
      cy.contains(input.title, { timeout: 10000 }).should('exist');
    })
    
    it("And the new item should be stored in the localStorage", () => {
      cy.window().then((window) => {
        const storedData = window.localStorage.getItem("tdd-ew-db");
        expect(storedData).to.not.be.null

        const parsedData = JSON.parse(storedData)
        const imageExists = parsedData.some(item => item.imageUrl == input.url)

        expect(imageExists).to.be.true
      })
    })

    it("Then The inputs should be cleared", () => {
      registerForm.elements.titleInput().should("have.value", "")
      registerForm.elements.imageUrlInput().should("have.value", "")
    })
  })
  describe('Submitting an image and updating the list', () => {
    after(() => {
      cy.clearAllLocalStorage()
    })
    it('Given I am on the image registration page', () => {
      cy.visit(baseUrl)
    })

    it(`Then I have entered "${input.title}" in the title field`, () => {
      registerForm.typeTitle(input.title)
    })

    it(`Then I have entered "${input.url}" in the URL field`, () => {
      registerForm.typeUrl(input.url)
    })

    it('When I click the submit button', () => {
      registerForm.elements.submitBtn().click()
    })

    it('And the list of registered images should be updated with the new item', () => {
      cy.contains(input.title)
    })

    it('And the new item should be stored in the localStorage', () => {
      cy.window().then((window) => {
        const storedData = window.localStorage.getItem("tdd-ew-db")
        expect(storedData).to.not.be.null

        const parsedData = JSON.parse(storedData)
        const imageExists = parsedData.some(item => item.imageUrl == input.url)

        expect(imageExists).to.be.true
      })
    })

    it('Then The inputs should be cleared', () => {
      registerForm.elements.titleInput().should("have.value", "")
      registerForm.elements.imageUrlInput().should("have.value", "")
    })
  })
  describe('Refreshing the page after submitting an image clicking in the submit button', () => {
    after(() => {
      cy.clearAllLocalStorage()
    })
    
    it('Given I am on the image registration page', () => {
      cy.visit(baseUrl)
    })

    it('Then I have submitted an image by clicking the submit button', () => {
      registerForm.typeTitle(input.title)
      registerForm.typeUrl(input.url)
      registerForm.elements.submitBtn().click()
      /*if(input.title.trim() !== "" && input.url.trim() !== ""){
        urls.push({ chaveTitle: input.title, chaveUrl: input.url })
      }*/

    })

    it('When I refresh the page', () => {
      cy.window().then((window) => {
        cy.window().reload(true)
      })

      /*urls.forEach(item =>{
        registerForm.typeTitle(item.chaveTitle)
        registerForm.typeUrl(item.chaveUrl)
        registerForm.elements.submitBtn().click()
      })
        */
    })

    it('Then I should still see the submitted image in the list of registered images', () => {
      cy.contains(input.title, { timeout: 10000 }).should('exist');
    })
  })
})