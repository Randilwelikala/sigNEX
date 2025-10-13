const waitingForYou = [
  { id: 1, title: "Document F", time: "22:33, 11 Aug 2025", sender: "Randil", due: "Due in 1 day", label: "NDA Contract", severity: "red" },
  { id: 2, title: "Document G", time: "22:33, 11 Aug 2025", sender: "Sahan", due: "Due in 3 days", label: "Contract", severity: "orange" },
  { id: 3, title: "Document H", time: "22:33, 11 Aug 2025", sender: "Tharukshi", due: "Due in 6 days", label: "Audit", severity: "green" },
  { id: 3, title: "Document I", time: "22:33, 11 Aug 2025", sender: "Nisandi", due: "Due in 3 days", label: "Audit", severity: "orange" }
];

const waitingForOthers = [
  { id: 4, title: "Document A", time: "10:15, 05 Aug 2025", sender: "Alex", due: "Due in 1 day", label: "NDA Contract", severity: "red" },
  { id: 5, title: "Document B", time: "14:40, 08 Aug 2025", sender: "Maria", due: "Due in 3 days", label: "Contract", severity: "orange" },
  { id: 6, title: "Document C", time: "09:00, 09 Aug 2025", sender: "John", due: "Due in 6 days", label: "NDA Contract", severity: "green" }
];

const tabYou = document.getElementById('tabYou');
const tabOthers = document.getElementById('tabOthers');
const taskList = document.getElementById('taskList');
const badgeYou = document.getElementById('badgeYou');
const badgeOthers = document.getElementById('badgeOthers');

const profilePic = document.getElementById('profilePic');
const profileDropdown = document.getElementById('profileDropdown');
const dropdownItems = profileDropdown ? profileDropdown.querySelectorAll('.dropdownItem') : [];

const sendModal = document.getElementById('sendModal');
const openSendButtons = document.querySelectorAll('[data-open-send]');
const closeModalBtn = document.getElementById('closeModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const sendNowBtn = document.getElementById('sendNow');
const signersInput = document.getElementById('signersInput');

function renderTaskList(list) {
  taskList.innerHTML = list.map(item => {
    const severityClass = item.severity === 'red' ? 'red' : item.severity === 'orange' ? 'orange' : 'green';
    return `
      <div class="taskRow" data-id="${item.id}">
        <div class="taskLeft">
          <div class="due ${severityClass}">${item.due}</div>
          <div>
            <div class="taskLabel">${item.label}</div>
            <div class="muted">${item.sender} • ${item.time}</div>
          </div>
        </div>
        <div class="taskActions" aria-hidden="true">
          <i class="fa-solid fa-eye" title="View"></i>
          <i class="fa-solid fa-pen" title="Edit"></i>
          <i class="fa-regular fa-bell" title="Remind"></i>
          <i class="fa-solid fa-xmark" title="Remove"></i>
        </div>
      </div>
    `;
  }).join('');

  gsap.from(".taskRow", {opacity:0, y:18, stagger:0.08, duration:0.45, ease: "power2.out"});
}

function updateBadges(){
  badgeYou.textContent = waitingForYou.length;
  badgeOthers.textContent = waitingForOthers.length;
  gsap.fromTo(".badge", {scale:0.6, opacity:0}, {scale:1, opacity:1, duration:0.5, ease:"back.out(1.4)"});
}

tabYou.addEventListener('click', () => {
  tabYou.classList.add('active'); tabOthers.classList.remove('active');
  renderTaskList(waitingForYou);
});
tabOthers.addEventListener('click', () => {
  tabOthers.classList.add('active'); tabYou.classList.remove('active');
  renderTaskList(waitingForOthers);
});

const sortButton = document.getElementById('sortButton');
const sortOptions = document.getElementById('sortOptions');

sortButton.addEventListener('click', (e) => {
  e.stopPropagation();
  sortOptions.style.display = sortOptions.style.display === 'block' ? 'none' : 'block';
});

sortOptions.addEventListener('click', e => e.stopPropagation());
document.addEventListener('click', () => { sortOptions.style.display = 'none'; });

tabYou.addEventListener('click', () => {
  tabYou.classList.add('active'); tabOthers.classList.remove('active');
  renderTaskList(waitingForYou);
});
tabOthers.addEventListener('click', () => {
  tabOthers.classList.add('active'); tabYou.classList.remove('active');
  renderTaskList(waitingForOthers);
});

document.addEventListener('DOMContentLoaded', () => {
  const sortOptionButtons = document.querySelectorAll('.sortOption');

  sortOptionButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const criteria = btn.dataset.sort;

      // Use the active tab's list
      const activeList = tabYou.classList.contains('active') ? waitingForYou : waitingForOthers;
      const sorted = [...activeList];

      if(criteria === 'alphabetical' || criteria === 'label') {
        sorted.sort((a,b) => a.label.localeCompare(b.label));
      } else if(criteria === 'due') {
        const getDays = str => parseInt(str.match(/\d+/)[0]);
        sorted.sort((a,b) => getDays(a.due) - getDays(b.due));
      }

      renderTaskList(sorted);
      sortOptions.style.display = 'none';
    });
  });
});

if (profilePic && profileDropdown) {
  profilePic.addEventListener('click', (e) => {
    e.stopPropagation();
    if (profileDropdown.style.display === 'flex') {
      gsap.to(Array.from(dropdownItems), {y:-8, opacity:0, stagger:0.05, duration:0.18, onComplete: () => profileDropdown.style.display = 'none'});
    } else {
      profileDropdown.style.display = 'flex';
      gsap.fromTo(Array.from(dropdownItems), {y:-8, opacity:0}, {y:0, opacity:1, duration:0.22, stagger:0.06, ease:"power2.out"});
    }
  });

  document.addEventListener('click', (e) => {
    if (!profileDropdown.contains(e.target) && e.target !== profilePic) {
      if(profileDropdown.style.display === 'flex'){
        gsap.to(Array.from(dropdownItems), {y:-8, opacity:0, stagger:0.05, duration:0.18, onComplete: () => profileDropdown.style.display = 'none'});
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && profileDropdown.style.display === 'flex') {
      gsap.to(Array.from(dropdownItems), {y:-8, opacity:0, stagger:0.05, duration:0.18, onComplete: () => profileDropdown.style.display = 'none'});
    }
  });
}

openSendButtons.forEach(btn => btn.addEventListener('click', openSendModal));
function openSendModal(e){
  e?.stopPropagation();
  sendModal.style.display = 'flex';
  sendModal.setAttribute('ariaHidden','false');
  gsap.fromTo(".modalPanel", {y:20, opacity:0}, {y:0, opacity:1, duration:0.28, ease:"power2.out"});
}
function closeSendModal(){
  gsap.to(".modalPanel", {y:8, opacity:0, duration:0.18, ease:"power2.in", onComplete: () => {
    sendModal.style.display = 'none';
    sendModal.setAttribute('ariaHidden','true');
  }});
}
closeModalBtn.addEventListener('click', closeSendModal);
modalBackdrop.addEventListener('click', closeSendModal);
document.addEventListener('keydown', (e) => { if(e.key==='Escape' && sendModal.style.display==='flex') closeSendModal(); });

if (window.Dropzone) {
  Dropzone.autoDiscover = false;
  const dz = new Dropzone("#uploadForm", {
    url: "/upload", 
    maxFilesize: 10,
    acceptedFiles: ".pdf,.doc,.docx,.png,.jpg",
    addRemoveLinks: true,
    init: function() {
      this.on("addedfile", (file) => { gsap.from(file.previewElement, {opacity:0, y:-6, duration:0.25}); });
      this.on("uploadprogress", (file, prog) => { /* optional custom progress UI */ });
      this.on("success", (file) => { /* handle success */ });
      this.on("error", (file) => { /* handle error */ });
    }
  });
}

if (sendNowBtn) {
  sendNowBtn.addEventListener('click', () => {
    const signers = (signersInput.value || "").split(",").map(s => s.trim()).filter(Boolean);
    gsap.fromTo(sendNowBtn, {scale:1}, {scale:0.98, duration:0.06, yoyo:true, repeat:1});
    const notifDot = document.getElementById('notifDot');
    gsap.fromTo(notifDot, {scale:0}, {scale:1.05, background:varOr('--danger','#ef4444'), duration:0.35, ease:"elastic.out(1,0.6)"});
    setTimeout(() => closeSendModal(), 600);
  });
}

renderTaskList(waitingForYou);
updateBadges();

gsap.from(".sidebar", {x:-18, opacity:0, duration:0.6, ease:"power2.out"});
gsap.from(".topbar", {y:-20, opacity:0, duration:0.6});
gsap.from(".ovCard", {opacity:0, y:16, stagger:0.08, duration:0.45});
gsap.from(".rightColumn > *", {opacity:0, x:12, stagger:0.06, duration:0.45});
gsap.from(".featureBox", {opacity:0, y:10, stagger:0.06, duration:0.45});

document.addEventListener('click', (e) => {
  if (e.target.closest('.taskActions i')) {
    const icon = e.target.closest('i');
    gsap.fromTo(icon, {scale:1}, {scale:1.15, duration:0.12, yoyo:true, repeat:1});
  }
});

try {
  if (typeof io === 'function') {
    const socket = io(); 
    socket.on('connect', () => {
      console.log('socket connected', socket.id);
    });
    socket.on('newTask', (task) => {
      waitingForYou.unshift(task);
      updateBadges();
      renderTaskList(waitingForYou);
    });
  }
} catch (err) {
  console.warn('Socket.IO not available (or no server). Continuing in fallback mode.');
}

const navItems = document.querySelectorAll(".navItem");

navItems.forEach(item => {
  item.addEventListener("click", () => {  
    navItems.forEach(i => i.classList.remove("active"));    
    item.classList.add("active");
  });
});

const hamburgerBtn = document.getElementById('hamburgerBtn');
hamburgerBtn.addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('open');
});
