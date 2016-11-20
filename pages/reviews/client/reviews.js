function userEmail(){
  var user = Meteor.user();
  if (user.services.google){
    return user.services.google.email;
  } else if (user.emails) {
    return user.emails[0].address;
  } else {
    return "no-email";
  }
}
Session.set("teamURL","");
Session.set("teamTitle","");


Template.reviewForm.helpers({
  teams: function(){
    return Teams.find({reviewers:{$not:{$in:[Meteor.userId()]}}})},
  reviews: function(){
    return Reviews.find({reviewer:Meteor.userId()})},
  numReviews: function(team ){
    return team.reviewers.length;},
  teamURL: function(){return Session.get("teamURL");},
  teamTitle: function(){return Session.get("teamTitle");},
});

Template.yourReviews.helpers({
  reviews: function(){
    return Reviews.find({reviewer:Meteor.userId()})},
})


Template.reviewForm.events({
  "change select#team": function(event){
    const teamNum=parseInt($("#team").val());
    const team = Teams.findOne({num:teamNum});
    Session.set("teamURL",team.url);
    Session.set("teamTitle",team.title);
  },

  "click #submitReview": function(event){
    const team=parseInt($("#team").val());
    console.log("you selected team "+team);
    const like=$("#likeAboutGame").val();
    console.log(like);
    const improve = $("#improveGame").val();
    console.log(improve);
    const rating = $("#rating").val();
    console.log("rating = "+rating);
    const reviewer=Meteor.userId();
    const theTeam = Teams.findOne({num:team});
    Teams.update(theTeam._id,{$push:{reviewers:reviewer}})
    const review=
      {team,like,improve,rating,reviewer};
    Reviews.insert(review);
  },

  "click .deleteReview": function(event){
    console.dir(this);
    team = Teams.findOne({num:this.review.team});
    Teams.update(team._id,
      {$set:
        {reviewers:_.without(team.reviewers,Meteor.userId())}});
    Reviews.remove(this.review._id);
  }
});

Template.reviewEntry.helpers({
  title: function(n){
    console.log(n-0);
    const zz = Teams.findOne({num:n-0});
    console.dir(zz);
    return zz.title}
});

Template.teamlist.helpers({

})
