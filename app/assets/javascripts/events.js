$(document).ready(function() {
   $("#calendar").fullCalendar({
     events: "/events/get_events",
     timeFormat: "LT",
     defaultView: 'month',
     header: {
       left: 'title',
       center: '',
       right: 'prev,next month,agendaWeek,agendaDay',
     },
     height: 550

  });
});

function createGmap(dataFromServer) {
  handler = Gmaps.build('Google');
  handler.buildMap({
      provider: {},
      internal: {id: 'event_map'}
    },
    function() {
      markers = handler.addMarkers(dataFromServer);
      handler.bounds.extendWith(markers);
      handler.fitMapToBounds();
      handler.getMap().setZoom(12)
    }
  );
};

function loadAndCreateGmap() {
  // Only load map data if we have a map on the page
  if ($('#event_map').length > 0) {
    // Access the data-apartment-id attribute on the map element
    var eventId = $('#event_map').attr('data-event-id');

    $.ajax({
      dataType: 'json',
      url: '/events/' + eventId + '/map_location',
      method: 'GET',
      success: function(dataFromServer) {
        createGmap(dataFromServer);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        alert("Getting map data failed: " + errorThrown);
      }
    });
  }
};

// Create the map when the page loads the first time
$(document).on('ready', loadAndCreateGmap);
// Create the map when the contents is loaded using turbolinks
// To be 'turbolinks:load' in Rails 5
//$(document).on('page:load', loadAndCreateGmap);
// To be 'turbolinks:load' in Rails 4
//$(document).on('turbolinks:load', loadAndCreateGmap);
