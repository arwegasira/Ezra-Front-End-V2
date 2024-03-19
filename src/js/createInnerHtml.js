const moment = require('moment')

const htmlContent = ({ unitPrice, startDate, endDate, roomName, title }) => {
  return {
    editAccommodation: ` <h4 class ='edit-acc-title'>Edit Accommodation</h4>
        <form action="" class="edit-accommodation-form">
            <div class="edit-acc edit-acc-start">
              <label for="startDate">Start Date</label>
              <input
                type="date"
                name="startDate"
                id="startDate"
                class="edit-acc-startDate-input"
                value=${startDate}
              />
            </div>
             <div class="edit-acc edit-acc-end">
              <label for="endDate">End Date</label>
              <input
                type="date"
                name="endDate"
                id="endDate"
                class="edit-acc-endDate"
                value=${endDate}
              />
            </div>

             <div class="edit-acc edit-acc-room">
              <label for="room">Choose Room</label>
              <select name="roomName" id="room" class="edit-acc-room-selector">
              <option value=${roomName} selected>${roomName}</option>
              </select>
            </div>
             <div class="edit-acc edit-acc-unitPrice">
              <label for="unitPrice">Unit Price</label>
              <input
                type="Number"
                name="unitPrice"
                id="unitPrice"
                class="edit-acc-unitPrice-input"
                disabled =${true}
                value=${unitPrice}
                style="background-color:#E8E9EB"
              />
            </div>

             <div class="edit-acc edit-acc-overridePrice">
              <label for="overridePrice">Override Price</label>
              <input
                type="Number"
                name="price"
                id="overridePrice"
                class="edit-acc-overridePrice"
              />
            </div>

            <div class="edit-accommodation submit-btn">
                <input
                type="submit"
                name="cancel"
                id="cancel-editAcc"
                class="cancel"
                value="Cancel"
              />
              <input
                type="submit"
                name="submit"
                id="submit-editAcc"
                class="submit"
                value="Save"
              />

            </div>
            
          </form>
`,
    newService: `<h4 class ='add-service-title'>${title}</h4>
        <form action="" class="new-service-form">

             <div class="new-service new-service-name">
              <label for="service">Choose Service</label>
              <select name="service" id="service" class="new-service-service-selector">
              <option value="Choose Service" selected disabled>Choose Service</option>
              <option value="Food and Beverage">Food and Beverage</option>
              <option value="Laundry">Laundry</option>
              </select>
            </div>

            <div class="new-service new-service-price">
              <label for="price">Amount</label>
              <input
                type="Number"
                name="price"
                id="price"
                class="new-service-price-input"
              />
            </div>

            <div class="new-service submit-btn">
                <input
                type="submit"
                name="cancel"
                id="cancel-new-service"
                class="cancel"
                value="Cancel"
              />
              <input
                type="submit"
                name="submit"
                id="submit-new-service"
                class="submit"
                value="Save"
              />

            </div>
            
          </form>`,
  }
}
export const buildHtml = ({
  parent,
  context,
  startDate,
  endDate,
  roomDetails,
  unitPrice,
}) => {
  if (context === 'edit active accommodation') {
    // parent.innerHTML = content.editAccommodation
    parent.innerHTML = htmlContent({
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD'),
      unitPrice,
      roomName: roomDetails.name,
    }).editAccommodation
  }
  if (context === 'new service') {
    parent.innerHTML = htmlContent({ title: 'Add New Service' }).newService
  }
}
