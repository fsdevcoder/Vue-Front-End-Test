import { mount, createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import OrderDescriptionComponent from '@/components/order-description-component.vue'

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const ORDER_DESCRIPTION = {
  "id":22,
  "name":"10 healthy fruits you should eat",
  "publication":"healthyfruits.com",
  "before_submit_price":null,
  "description":"Enter the details of the article you want to order",
  "full_description":"Enter the details of the article you want to order",
  "order":1
};
describe("order-description-component", () => {
  const wrapper = mount(OrderDescriptionComponent, {
    localVue,
    propsData: {
      "order-description": ORDER_DESCRIPTION
    }
  })
  it("has absolutePublication url", () => {
    expect(wrapper.find(".home a").attributes('href')).toBe("https://healthyfruits.com");
  })
})
