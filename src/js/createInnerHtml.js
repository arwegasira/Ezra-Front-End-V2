const content = {
  editAccommodation: ` <h4 class ='edit-acc-title'>Edit Accommodation</h4>
        <form action="" class="edit-accommodation-form">
            <div class="edit-acc edit-acc-start">
              <label for="startDate">Start Date</label>
              <input
                type="date"
                name="startDate"
                id="startDate"
                class="edit-acc-startDate-input"
              />
            </div>
             <div class="edit-acc edit-acc-end">
              <label for="endDate">End Date</label>
              <input
                type="date"
                name="endDate"
                id="endDate"
                class="edit-acc-endDate"
              />
            </div>

             <div class="edit-acc edit-acc-room">
              <label for="room">Choose Room</label>
              <select name="roomName" id="room" class="edit-acc-room-selector">
      
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
}
export const buildHtml = ({ parent, context }) => {
  if (context === 'edit active accommodation') {
    parent.innerHTML = content.editAccommodation
  }
}
