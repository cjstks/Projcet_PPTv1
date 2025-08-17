// 전역 변수
let current = 0;
const slides = document.querySelectorAll('.slide');
let stpStep = 0, pvstStep = 0, rstpStep = 0;
let bpduAnimations = [];
let stormStep = 0;

// 슬라이드 표시 함수
function showSlide(index) {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));

    // 애니메이션 초기화
    resetAllAnimations();

    // 각 슬라이드별 초기 상태 설정
    if (slides[index].querySelector('#stormDiagram')) {
        stormStep = 0;
        resetStormAnimation();
    }
    if (slides[index].querySelector('#stpDiagram')) {
        stpStep = 0;
        resetSTPAnimation();
        updateStepIndicator('stp', stpStep, 6);
    }
    if (slides[index].querySelector('#pvstDiagram')) {
        pvstStep = 0;
        resetPVSTAnimation();
        updateStepIndicator('pvst', pvstStep, 5);
    }
    if (slides[index].querySelector('#rstpDiagram')) {
        rstpStep = 0;
        resetRSTPAnimation();
        updateStepIndicator('rstp', rstpStep, 4);
    }
}

// 모든 애니메이션 초기화
function resetAllAnimations() {
    // 모든 BPDU 애니메이션 정지 및 제거
    bpduAnimations.forEach(anim => {
        if (anim.frameId) cancelAnimationFrame(anim.frameId);
        if (anim.element) anim.element.remove();
    });
    bpduAnimations = [];
}

// 단계 표시기 업데이트
function updateStepIndicator(type, current, total) {
    const indicator = document.getElementById(`${type}StepIndicator`);
    if (indicator) {
        indicator.textContent = `단계: ${current}/${total}`;
    }
}

// 키보드 이벤트 리스너
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') nextStepOrSlide();
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') prevStep();
});

// 다음 단계 또는 슬라이드
function nextStepOrSlide() {
    const slide = slides[current];

    if (slide.querySelector('#stormDiagram')) {
        if (stormStep === 0) {
            // 첫 번째 클릭: 애니메이션 실행
            runStormAnimation();
            stormStep = 1;
        } else {
            // 두 번째 클릭: 다음 슬라이드로
            if (current < slides.length - 1) {
                current++;
                showSlide(current);
            }
        }
        return;
    }

    if (slide.querySelector('#stpDiagram')) {
        if (stpStep < 6) {
            stpStep++;
            runSTPStep(stpStep);
            updateStepIndicator('stp', stpStep, 6);
        } else if (current < slides.length - 1) {
            current++;
            showSlide(current);
        }
        return;
    }

    if (slide.querySelector('#pvstDiagram')) {
        if (pvstStep < 5) {
            pvstStep++;
            runPVSTStep(pvstStep);
            updateStepIndicator('pvst', pvstStep, 5);
        } else if (current < slides.length - 1) {
            current++;
            showSlide(current);
        }
        return;
    }

    if (slide.querySelector('#rstpDiagram')) {
        if (rstpStep < 4) {
            rstpStep++;
            runRSTPStep(rstpStep);
            updateStepIndicator('rstp', rstpStep, 4);
        } else if (current < slides.length - 1) {
            current++;
            showSlide(current);
        }
        return;
    }

    // 일반 슬라이드
    if (current < slides.length - 1) {
        current++;
        showSlide(current);
    }
}

// 이전 슬라이드
function prevSlide() {
    if (current > 0) {
        current--;
        showSlide(current);
    }
}

// 이전 단계
function prevStep() {
    const slide = slides[current];

    if (slide.querySelector('#stormDiagram')) {
        // Storm 슬라이드에서는 이전 슬라이드로 이동
        prevSlide();
        return;
    }

    if (slide.querySelector('#stpDiagram')) {
        if (stpStep > 0) {
            stpStep--;
            resetSTPAnimation();
            // 이전 단계까지 순차적으로 실행
            for (let i = 1; i <= stpStep; i++) {
                setTimeout(() => runSTPStep(i), i * 300);
            }
            updateStepIndicator('stp', stpStep, 6);
        } else {
            // 단계가 0일 때는 이전 슬라이드로
            prevSlide();
        }
        return;
    }

    if (slide.querySelector('#pvstDiagram')) {
        if (pvstStep > 0) {
            pvstStep--;
            resetPVSTAnimation();
            // 이전 단계까지 순차적으로 실행
            for (let i = 1; i <= pvstStep; i++) {
                setTimeout(() => runPVSTStep(i), i * 400);
            }
            updateStepIndicator('pvst', pvstStep, 5);
        } else {
            // 단계가 0일 때는 이전 슬라이드로
            prevSlide();
        }
        return;
    }

    if (slide.querySelector('#rstpDiagram')) {
        if (rstpStep > 0) {
            rstpStep--;
            resetRSTPAnimation();
            // 이전 단계까지 순차적으로 실행
            for (let i = 1; i <= rstpStep; i++) {
                setTimeout(() => runRSTPStep(i), i * 300);
            }
            updateStepIndicator('rstp', rstpStep, 4);
        } else {
            // 단계가 0일 때는 이전 슬라이드로
            prevSlide();
        }
        return;
    }

    // 애니메이션 슬라이드가 아닌 경우 이전 슬라이드로
    prevSlide();
}

// === 애니메이션 초기화 함수들 ===
function resetStormAnimation() {
    ['sw1', 'sw2', 'sw3', 'sw4'].forEach(id => {
        const sw = document.getElementById(id);
        if (sw) {
            sw.classList.remove('looping', 'off');
            sw.style.background = '#4FC3F7';
        }
    });
}

function resetSTPAnimation() {
    // 노드 초기화
    const root = document.getElementById('stp-root');
    const sw2 = document.getElementById('stp-sw2');
    const sw3 = document.getElementById('stp-sw3');

    [root, sw2, sw3].forEach(node => {
        if (node) {
            node.style.background = '#4FC3F7';
            node.classList.remove('highlight', 'comparing');
        }
    });

    // Bridge ID 초기화
    ['root-id', 'sw2-id', 'sw3-id'].forEach(id => {
        const bridgeId = document.getElementById(id);
        if (bridgeId) {
            bridgeId.classList.remove('show', 'winner');
        }
    });

    // 링크 초기화
    const links = ['link-r-s2', 'link-r-s3', 'link-s2-s3'];
    links.forEach(id => {
        const link = document.getElementById(id);
        if (link) {
            link.setAttribute('stroke', 'white');
            link.removeAttribute('stroke-dasharray');
            link.style.opacity = '1';
        }
    });

    // 포트 라벨 초기화 - 모두 숨김
    const portLabels = ['rp1', 'rp2', 'dp1', 'dp2', 'dp3', 'ap1'];
    portLabels.forEach(id => {
        const label = document.getElementById(id);
        if (label) {
            label.classList.remove('show');
        }
    });

    // BPDU 제거
    document.querySelectorAll('#stpDiagram .bpdu').forEach(bpdu => bpdu.remove());
}

function resetPVSTAnimation() {
    const vlans = ['vlan10', 'vlan20', 'vlan30', 'vlan40'];
    vlans.forEach(id => {
        const node = document.getElementById(id);
        if (node) {
            node.classList.remove('highlight');
            node.style.opacity = '1';
        }
    });

    document.querySelectorAll('#pvstDiagram .bpdu').forEach(bpdu => bpdu.remove());
}

function resetRSTPAnimation() {
    const nodes = ['rstp-root', 'rstp-sw1', 'rstp-sw2', 'rstp-sw3'];
    nodes.forEach(id => {
        const node = document.getElementById(id);
        if (node) {
            node.style.background = '#4FC3F7';
            node.classList.remove('highlight');
        }
    });

    document.querySelectorAll('#rstpDiagram .bpdu').forEach(bpdu => bpdu.remove());
}

// === 애니메이션 실행 함수들 ===
function runStormAnimation() {
    const sws = ['sw1', 'sw2', 'sw3', 'sw4'].map(id => document.getElementById(id));
    let interval = 500;

    const anim = setInterval(() => {
        sws.forEach(sw => {
            if (sw) sw.classList.toggle('looping');
        });
        interval -= 80;

        if (interval <= 100) {
            clearInterval(anim);
            sws.forEach(sw => {
                if (sw) {
                    sw.classList.remove('looping');
                    sw.classList.add('off');
                }
            });
        }
    }, interval);
}

function runSTPStep(step) {
    const root = document.getElementById('stp-root');
    const sw2 = document.getElementById('stp-sw2');
    const sw3 = document.getElementById('stp-sw3');
    const linkRS2 = document.getElementById('link-r-s2');
    const linkRS3 = document.getElementById('link-r-s3');
    const linkS2S3 = document.getElementById('link-s2-s3');

    switch (step) {
        case 1:
            // Bridge ID 표시 및 비교 시작
            showBridgeIDs();
            startBridgeComparison();
            break;

        case 2:
            // Root Bridge 선정 결과
            selectRootBridge();
            break;

        case 3:
            // BPDU 전송 시뮬레이션 + 루트 포트 표시
            createBPDU('stpDiagram', root, sw2, '#FFD700');
            createBPDU('stpDiagram', root, sw3, '#FFD700');

            // 루트 포트 라벨 표시
            const rootPorts = ['rp1', 'rp2'];
            rootPorts.forEach((id, index) => {
                setTimeout(() => {
                    const label = document.getElementById(id);
                    if (label) label.classList.add('show');
                }, 300 * (index + 1));
            });
            break;

        case 4:
            // 경로 비용 계산 + 지정 포트 표시
            if (sw2) {
                sw2.style.background = '#32CD32';
                sw2.classList.add('highlight');
            }
            if (sw3) {
                sw3.style.background = '#32CD32';
                sw3.classList.add('highlight');
            }
            if (linkRS2) linkRS2.setAttribute('stroke', '#32CD32');
            if (linkRS3) linkRS3.setAttribute('stroke', '#32CD32');

            // 지정 포트 라벨 표시
            const designatedPorts = ['dp1', 'dp3'];
            designatedPorts.forEach((id, index) => {
                setTimeout(() => {
                    const label = document.getElementById(id);
                    if (label) label.classList.add('show');
                }, 200 * (index + 1));
            });
            break;

        case 5:
            // 블로킹 포트 결정 + 대체 포트 표시
            if (linkS2S3) {
                linkS2S3.setAttribute('stroke', '#FF4500');
                linkS2S3.setAttribute('stroke-dasharray', '10,5');
            }

            // 대체 포트 라벨 표시
            const alternatePorts = ['dp2', 'ap1'];
            alternatePorts.forEach((id, index) => {
                setTimeout(() => {
                    const label = document.getElementById(id);
                    if (label) label.classList.add('show');
                }, 300 * (index + 1));
            });
            break;

        case 6:
            // 루프 차단
            if (linkS2S3) {
                linkS2S3.style.opacity = '0';
            }
            break;
    }
}

function showBridgeIDs() {
    ['root-id', 'sw2-id', 'sw3-id'].forEach(id => {
        const bridgeId = document.getElementById(id);
        if (bridgeId) {
            bridgeId.classList.add('show');
        }
    });
}

function startBridgeComparison() {
    const root = document.getElementById('stp-root');
    const sw2 = document.getElementById('stp-sw2');
    const sw3 = document.getElementById('stp-sw3');

    // 모든 노드에 비교 애니메이션 적용
    [root, sw2, sw3].forEach(node => {
        if (node) {
            node.classList.add('comparing');
        }
    });
}

function selectRootBridge() {
    const root = document.getElementById('stp-root');
    const sw2 = document.getElementById('stp-sw2');
    const sw3 = document.getElementById('stp-sw3');
    const rootId = document.getElementById('root-id');

    // 비교 애니메이션 제거
    [root, sw2, sw3].forEach(node => {
        if (node) {
            node.classList.remove('comparing');
        }
    });

    // Root Bridge 선정
    if (root) {
        root.style.background = '#FFD700';
        root.classList.add('highlight');
    }

    // Winner Bridge ID 표시
    if (rootId) {
        rootId.classList.add('winner');
    }
}

function runPVSTStep(step) {
    const vlans = [
        { id: 'vlan10', color: '#FFD700' },
        { id: 'vlan20', color: '#FF4500' },
        { id: 'vlan30', color: '#32CD32' },
        { id: 'vlan40', color: '#1E90FF' }
    ];

    if (step <= vlans.length) {
        const vlan = vlans[step - 1];
        const node = document.getElementById(vlan.id);
        if (node) {
            node.classList.add('highlight');

            // VLAN별로 케이블을 따라 BPDU 전송
            sendPVSTBPDUs(vlan);
        }
    } else if (step === 5) {
        // 모든 VLAN에서 동시에 BPDU 전송
        vlans.forEach(vlan => {
            const node = document.getElementById(vlan.id);
            if (node) {
                node.classList.add('highlight');
                sendPVSTBPDUs(vlan);
            }
        });
    }
}

function sendPVSTBPDUs(vlan) {
    const container = document.getElementById('pvstDiagram');
    if (!container) return;

    const startNode = document.getElementById(vlan.id);
    if (!startNode) return;

    // 케이블 경로 정의 (사각형 네트워크의 모든 경로)
    const cablePaths = [
        // 시계방향으로 상단 케이블
                { start: 'vlan10', end: 'vlan20', waypoints: [{x: 80, y: 80}, {x: 420, y: 80}] },
                // 우측 케이블
                { start: 'vlan20', end: 'vlan40', waypoints: [{x: 400, y: 60}, {x: 400, y: 300}] },
                // 하단 케이블
                { start: 'vlan40', end: 'vlan30', waypoints: [{x: 440, y: 300}, {x: 80, y: 300}] },
                // 좌측 케이블
                { start: 'vlan30', end: 'vlan10', waypoints: [{x: 40, y: 340}, {x: 40, y: 60}] },
                // 반시계방향 경로들
                { start: 'vlan10', end: 'vlan30', waypoints: [{x: 30, y: 60}, {x: 30, y: 300}] },
                { start: 'vlan30', end: 'vlan40', waypoints: [{x: 80, y: 290}, {x: 440, y: 290}] },
                { start: 'vlan40', end: 'vlan20', waypoints: [{x: 400, y: 300}, {x: 400, y: 60}] },
                { start: 'vlan20', end: 'vlan10', waypoints: [{x: 420, y: 80}, {x: 60, y: 80}] }
    ];

    // 현재 VLAN에서 시작하는 모든 경로 찾기
    const relevantPaths = cablePaths.filter(path => path.start === vlan.id);

    relevantPaths.forEach((path, index) => {
        setTimeout(() => {
            createCableBPDU(container, path.waypoints, vlan.color);
        }, index * 200); // 각 경로마다 0.2초씩 딜레이
    });
}

function createCableBPDU(container, waypoints, color) {
    const bpdu = document.createElement('div');
    bpdu.classList.add('bpdu');
    bpdu.style.background = color;
    bpdu.style.zIndex = '10';
    container.appendChild(bpdu);

    let currentWaypoint = 0;
    let t = 0;
    const speed = 0.025;

    function animate() {
        if (currentWaypoint >= waypoints.length - 1) {
            // 애니메이션 완료
            return;
        }

        const start = waypoints[currentWaypoint];
        const end = waypoints[currentWaypoint + 1];

        t += speed;

        if (t >= 1) {
            // 다음 웨이포인트로 이동
            t = 0;
            currentWaypoint++;

            if (currentWaypoint >= waypoints.length - 1) {
                // 마지막 지점에 도달하면 BPDU 제거
                setTimeout(() => {
                    if (bpdu.parentNode) {
                        bpdu.remove();
                    }
                }, 500);
                return;
            }
        }

        // 현재 위치 계산
        const currentStart = waypoints[currentWaypoint];
        const currentEnd = waypoints[currentWaypoint + 1];

        const x = currentStart.x + (currentEnd.x - currentStart.x) * t;
        const y = currentStart.y + (currentEnd.y - currentStart.y) * t;

        bpdu.style.left = (x - 6) + 'px';
        bpdu.style.top = (y - 6) + 'px';

        const frameId = requestAnimationFrame(animate);
        bpduAnimations.push({ element: bpdu, frameId });
    }

    animate();
}

function runRSTPStep(step) {
    const root = document.getElementById('rstp-root');
    const sw1 = document.getElementById('rstp-sw1');
    const sw2 = document.getElementById('rstp-sw2');

    switch (step) {
        case 1:
            if (root) {
                root.style.background = '#FFD700';
                root.classList.add('highlight');
            }
            break;

        case 2:
            // 빠른 BPDU 교환
            if (root && sw1) createBPDU('rstpDiagram', root, sw1, '#FFD700');
            if (root && sw2) createBPDU('rstpDiagram', root, sw2, '#FFD700');
            break;

        case 3:
            if (sw2) {
                sw2.style.background = '#32CD32';
                sw2.classList.add('highlight');
            }
            break;

        case 4:
            if (sw1) {
                sw1.style.background = '#FF4500';
                sw1.classList.add('highlight');
            }
            break;
    }
}

function createBPDU(containerId, startNode, endNode, color) {
    if (!startNode || !endNode) return;

    const container = document.getElementById(containerId);
    if (!container) return;

    const bpdu = document.createElement('div');
    bpdu.classList.add('bpdu');
    bpdu.style.background = color;
    container.appendChild(bpdu);

    const startRect = startNode.getBoundingClientRect();
    const endRect = endNode.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const start = {
        x: startRect.left - containerRect.left + startRect.width / 2 - 6,
        y: startRect.top - containerRect.top + startRect.height / 2 - 6
    };

    const end = {
        x: endRect.left - containerRect.left + endRect.width / 2 - 6,
        y: endRect.top - containerRect.top + endRect.height / 2 - 6
    };

    let t = 0;
    const speed = 0.02;

    function animate() {
        t += speed;
        if (t > 1) t = 0;

        bpdu.style.left = (start.x + (end.x - start.x) * t) + 'px';
        bpdu.style.top = (start.y + (end.y - start.y) * t) + 'px';

        const frameId = requestAnimationFrame(animate);
        bpduAnimations.push({ element: bpdu, frameId });
    }

    animate();
}

// DOM이 로드된 후 초기 슬라이드 표시
document.addEventListener('DOMContentLoaded', function() {
    showSlide(0);
});