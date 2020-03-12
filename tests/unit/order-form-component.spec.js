import { mount, createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import OrderFormComponent from '@/components/order-form-component.vue'

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const ORDER_DETAILS = [
  {
     "id":24,
     "name":"source",
     "placeholder":"enter a link"
  },
  {
     "id":25,
     "name":"instructions",
     "placeholder":"enter your instructions"
  },
  {
     "id":26,
     "name":"number_writers",
     "placeholder":"select"
  },
  {
     "id":27,
     "name":"budget",
     "placeholder":"budget in USD"
  }
];
const ORDER_OPTIONS = [
  {
     "id":222,
     "name":"Bilingual",
     "extra_id":2222,
     "increase":"20"
  },
  {
     "id":223,
     "name":"Copy-Editing",
     "extra_id":2223,
     "increase":"10"
  },
  {
     "id":224,
     "name":"Proof-reading",
     "extra_id":2224,
     "price":"20"
  }
];

describe("order-form-component", () => {
  const wrapper = mount(OrderFormComponent, {
    localVue,
    propsData: {
      "order-details": ORDER_DETAILS,
      "order-options": ORDER_OPTIONS
    }
  })
  it("has source placeholder", () => {
    expect(wrapper.find("#input-source").attributes('placeholder')).toBe("enter a link");
  })
  it("has instructions placeholder", () => {
    expect(wrapper.find("#input-instructions").attributes('placeholder')).toBe("enter your instructions");
  })
  it("has number_writers placeholder", () => {
    expect(wrapper.find("#input-writers").attributes('placeholder')).toBe("select");
  })
  it("has budget placeholder", () => {
    expect(wrapper.find("#input-budget").attributes('placeholder')).toBe("budget in USD");
  })
  it("has option labels", () => {
    const additionalWrappers = wrapper.findAll(".optional-fields .additional");
    expect(additionalWrappers.length).toBe(3);
    const additionals = additionalWrappers.wrappers.map(wrapper => wrapper.text());
    expect(additionals).toEqual(["(add 20%)", "(add 10%)", "(add $20)"]);
  })

  it("doesnt have a budget", () => {
    expect(wrapper.find(".total-budget").text()).toBe("$ -");
  })
})

describe("order-form-component budget", () => {
  const wrapper = mount(OrderFormComponent, {
    localVue,
    propsData: {
      "order-details": ORDER_DETAILS,
      "order-options": ORDER_OPTIONS
    }
  })
  wrapper.setData({
    form: {
      source: 'www.google.com',
      instructions: 'Valid',
      writers: 2,
      options: ORDER_OPTIONS, // All options
      budget: 10
    },
  });

  it("has the right budget", () => {
    expect(wrapper.find(".total-budget").text()).toBe("$ " + ((10*2)*1.3+20).toFixed(2));
  })
});

