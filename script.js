// 전역 변수
    let current = 0;
    const slides = document.querySelectorAll('.slide');
    let stpStep = 0, pvstStep = 0, rstpStep = 0, mstpStep = 0;
    let bpduAnimations = [];
    let stormStep = 0;
    let necessityStep = 0; // 필요성 슬라이드 단계 추가

    // 슬라이드 표시 함수
    function showSlide(index) {
        slides.forEach((s, i) => s.classList.toggle('active', i === index));

        // 애니메이션 초기화
        resetAllAnimations();

        // 각 슬라이드별 초기 상태 설정
        if (slides[index].querySelector('#stormDiagram')) {
            necessityStep = 0; // stormStep 대신 necessityStep 사용
            resetStormAnimation();
            resetNecessitySlide(); // 새로 추가된 함수
        }
        if (slides[index].querySelector('#stpDiagram')) {
            stpStep = 0;
            resetSTPAnimation();
            setRootBridge("stp-root");
            updateStepIndicator('stp', stpStep, 16); // 9 → 16로 변경
        }

        if (slides[index].querySelector('#pvstDiagram')) {
            pvstStep = 0;
            resetPVSTAnimation();
            updateStepIndicator('pvst', pvstStep, 5);
        }
        if (slides[index].querySelector('#rstpDiagram')) {
            rstpStep = 0;
            resetRSTPAnimation();
            updateStepIndicator('rstp', rstpStep, 8);
        }
        if (slides[index].querySelector('#mstpDiagram')){
            mstpStep = 0;
            resetMSTPAnimation();
            updateStepIndicator('mstp', mstpStep, 9);
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
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'PageDown') nextStepOrSlide();
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown' || e.key === 'PageUp') prevStep();
    });

    // 터치 이벤트 변수
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    // 터치 이벤트 리스너
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleTouchGesture();
    });

    // 터치 제스처 처리
    function handleTouchGesture() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const minSwipeDistance = 50; // 최소 스와이프 거리

        // 스와이프 감지
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                // 오른쪽 스와이프 - 이전 슬라이드/단계
                prevStep();
            } else {
                // 왼쪽 스와이프 - 다음 슬라이드/단계
                nextStepOrSlide();
            }
        } else {
            // 탭 (짧은 터치) 감지
            const screenWidth = window.innerWidth;
            const tapZone = screenWidth / 2;

            if (touchStartX > tapZone) {
                // 화면 오른쪽 탭 - 다음 슬라이드/단계
                nextStepOrSlide();
            } else {
                // 화면 왼쪽 탭 - 이전 슬라이드/단계
                prevStep();
            }
        }
    }

    // 다음 단계 또는 슬라이드
    function nextStepOrSlide() {
        const slide = slides[current];

        if (slide.querySelector('#stormDiagram')) {
            if (necessityStep === 0) {
                // 첫 번째 클릭: 이중화 필요성 표시
                showNecessityContent();
                necessityStep = 1;
            } else if (necessityStep === 1) {
                // 두 번째 클릭: 문제점 표시
                showProblemContent();
                necessityStep = 2;
            } else if (necessityStep === 2) {
                // 세 번째 클릭: 다이어그램과 애니메이션 실행
                showStormDiagram();
                necessityStep = 3;
            } else {
                // 네 번째 클릭: 다음 슬라이드로
                if (current < slides.length - 1) {
                    current++;
                    showSlide(current);
                }
            }
            return;
        }

        if (slide.querySelector('#stpDiagram')) {
            if (stpStep < 16) { // 9 → 15로 변경
                stpStep++;
                runSTPStep(stpStep);
                updateStepIndicator('stp', stpStep, 16); // 9 → 16로 변경
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
            if (rstpStep < 8) {
                rstpStep++;
                runRSTPStep(rstpStep);
                updateStepIndicator('rstp', rstpStep, 8);
            } else if (current < slides.length - 1) {
                current++;
                showSlide(current);
            }
            return;
        }

        if (slide.querySelector('#mstpDiagram')){
            if (mstpStep < 9) {
                mstpStep++;
                runMSTPStep(mstpStep);
                updateStepIndicator('mstp', mstpStep, 9);
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
            if (necessityStep > 0) {
                necessityStep--;
                resetNecessitySlide();
                // 이전 단계까지 순차적으로 실행
                for (let i = 1; i <= necessityStep; i++) {
                    setTimeout(() => {
                        if (i === 1) showNecessityContent();
                        else if (i === 2) showProblemContent();
                        else if (i === 3) showStormDiagram();
                    }, i * 300);
                }
            } else {
                // 단계가 0일 때는 이전 슬라이드로
                prevSlide();
            }
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
                updateStepIndicator('stp', stpStep, 16); // 9 → 15로 변경
            } else {
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
                updateStepIndicator('rstp', rstpStep, 8);
            } else {
                // 단계가 0일 때는 이전 슬라이드로
                prevSlide();
            }
            return;
        }

        if (slide.querySelector('#mstpDiagram')) {
            if (mstpStep > 0) {
                mstpStep--;
                resetMSTPAnimation();
                // 이전 단계까지 순차적으로 실행
                for (let i = 1; i <= mstpStep; i++) {
                    setTimeout(() => runMSTPStep(i), i * 400);
                }
                updateStepIndicator('mstp', mstpStep, 9)
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

    // 초기화 함수도 수정
    function resetNecessitySlide() {
        const sections = ['.necessity-content .redundancy-section', '.necessity-content .problem-section', '.loop-diagram', '.solution-preview'];
        sections.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.display = 'none';
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
            }
        });

        // 스위치 노드 초기화
        const swNodes = document.querySelectorAll('#stormDiagram .node');
        swNodes.forEach(sw => {
            sw.classList.remove('storm-active', 'overloaded');
            sw.style.backgroundColor = '';
        });

        // 펄스 도트 초기화
        const pulseDots = document.querySelectorAll('.pulse-dot');
        pulseDots.forEach(dot => {
            dot.style.display = 'none';
            dot.classList.remove('pulse-animation');
            dot.style.animationDuration = '';
        });

        // 패킷 초기화
        const packets = document.querySelectorAll('.packet');
        packets.forEach(packet => {
            packet.classList.remove('active', 'storm-mode', 'overload-mode');
            packet.setAttribute('r', '4');
            const animation = packet.querySelector('animateMotion');
            if (animation) {
                animation.setAttribute('dur', '1.5s');
            }
        });

        // 케이블 초기화
        const cables = document.querySelectorAll('.active-link');
        cables.forEach(cable => {
            cable.classList.remove('transmitting');
            cable.style.stroke = '#00ff88';
            cable.style.strokeWidth = '4';
            cable.style.opacity = '1';
            cable.style.filter = 'drop-shadow(0 0 2px #00ff88)';
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

    function setRootBridge(switchId) {
            // 모든 스위치에서 'root' 클래스 제거
            document.querySelectorAll('.node').forEach(sw => {
                sw.classList.remove('root');
            });

            // 지정한 스위치에 'root' 클래스 추가
                const rootSwitch = document.getElementById(switchId);
                if (rootSwitch) {
                    rootSwitch.classList.add('root');
                }
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
        // 노드 초기화
        const nodes = ['rstp-root', 'rstp-sw1', 'rstp-sw2', 'rstp-sw3'];
        nodes.forEach(id => {
            const node = document.getElementById(id);
            if (node) {
                node.style.background = '#4FC3F7';
                node.classList.remove('highlight');
            }
        });

        // BPDU 초기화
        document.querySelectorAll('#rstpDiagram .bpdu').forEach(bpdu => bpdu.remove());

        // 링크 상태 초기화
        const links = ['link-sw1-sw3', 'link-sw1-sw2', 'link-sw2-sw3'];
        links.forEach(id => {
            const link = document.getElementById(id);
            if (link) {
                link.classList.remove('link-down');
                link.setAttribute('stroke', 'white');
                link.setAttribute('stroke-width', '4');
            }
        });
    }

    function resetMSTPAnimation() {
        const moveDistance = 250;

        // 기존 노드 초기화
        const oldNodes = [
            {id: 'old1', x: 350, y: 0},
            {id: 'old2', x: 500, y: 150},
            {id: 'old3', x: 350, y: 300},
            {id: 'old4', x: 200, y: 150}
        ];

        oldNodes.forEach(node => {
            const element = document.getElementById(node.id);
            if (element) {
                element.style.transform = 'translateX(0)';
                element.style.left = node.x + 'px';
                element.style.top = node.y + 'px';
                element.style.background = '#4FC3F7';
                element.classList.remove('highlight');
            }
        });

        // 새로운 노드 초기화
        const newNodes = [
            {id: 'new1', x: 350, y: 0},
            {id: 'new2', x: 500, y: 150},
            {id: 'new3', x: 350, y: 300},
            {id: 'new4', x: 200, y: 150}
        ];

        newNodes.forEach(node => {
            const element = document.getElementById(node.id);
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateX(0)';
                element.style.left = node.x + 'px';
                element.style.top = node.y + 'px';
                element.style.background = '#4FC3F7';
                element.classList.remove('highlight');
            }
        });

        // 라인 초기화
        const lines = [
            {id:'line1', x1:250, y1:190, x2:390, y2:50},
            {id:'line2', x1:400, y1:50, x2:540, y2:190},
            {id:'line3', x1:550, y1:220, x2:410, y2:360},
            {id:'line4', x1:390, y1:360, x2:250, y2:220}
        ];

        lines.forEach(l => {
            const line = document.getElementById(l.id);
            if (line) {
                line.setAttribute('x1', l.x1);
                line.setAttribute('y1', l.y1);
                line.setAttribute('x2', l.x2);
                line.setAttribute('y2', l.y2);
                line.setAttribute('stroke', 'white');
                line.setAttribute('stroke-width', '4');
            }
        });

        // 새로운 라인 초기화
        const newLines = [
            {id:'newLine1', x1:250, y1:190,  x2:390, y2:50},
            {id:'newLine2', x1:400, y1:50,  x2:540, y2:190},
            {id:'newLine3', x1:550, y1:220, x2:410, y2:360},
            {id:'newLine4', x1:390, y1:360, x2:250, y2:220}
        ];

        newLines.forEach(l => {
            const line = document.getElementById(l.id);
            if (line) {
                line.style.opacity = '0';
                line.setAttribute('x1', l.x1);
                line.setAttribute('y1', l.y1);
                line.setAttribute('x2', l.x2);
                line.setAttribute('y2', l.y2);
                line.setAttribute('stroke', 'white');
                line.setAttribute('stroke-width', '4');
            }
        });

        // 중앙 라인 초기화
        const centerLine = document.getElementById('center-line');
        if (centerLine) {
            centerLine.style.opacity = '0';
        }

        // 화살표 초기화
        const arrows = ['arrowBox-sw1', 'arrowBox-sw3', 'arrowBox-sw1_1', 'arrowBox-sw3_1'];
        arrows.forEach(id => {
            const arrow = document.getElementById(id);
            if (arrow) arrow.style.opacity = '0';
        });

        // VLAN 텍스트 초기화
        const vlanTexts = ['vlan-sw1', 'vlan-sw2', 'vlan-sw3', 'vlan-sw4'];
        vlanTexts.forEach(id => {
            const text = document.getElementById(id);
            if (text) text.style.opacity = '0';
        });

        // MST Region 텍스트 초기화
        const mstRegion = ['mst-region_A', 'mst-region_B'];
        mstRegion.forEach(id => {
            const mstRegion = document.getElementById(id);
            if (mstRegion) mstRegion.style.opacity = '0';
        });

    }

    // 1단계: 이중화 필요성만 표시 (다른 모든 섹션 숨김)
    function showNecessityContent() {
        // 먼저 모든 섹션 숨기기
        resetNecessitySlide();

        // 이중화 필요성 섹션만 표시
        const redundancySection = document.querySelector('.necessity-content .redundancy-section');
        if (redundancySection) {
            redundancySection.style.display = 'block';
            redundancySection.style.opacity = '0';
            redundancySection.style.transform = 'translateY(20px)';

            setTimeout(() => {
                redundancySection.style.transition = 'all 0.5s ease';
                redundancySection.style.opacity = '1';
                redundancySection.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    // 2단계: 문제점만 표시 (이전 섹션 숨김)
    function showProblemContent() {
        // 이전 섹션들 숨기기
        const redundancySection = document.querySelector('.necessity-content .redundancy-section');
        const loopDiagram = document.querySelector('.loop-diagram');
        const solutionPreview = document.querySelector('.solution-preview');

        if (redundancySection) redundancySection.style.display = 'none';
        if (loopDiagram) loopDiagram.style.display = 'none';
        if (solutionPreview) solutionPreview.style.display = 'none';

        // 문제점 섹션만 표시
        const problemSection = document.querySelector('.necessity-content .problem-section');
        if (problemSection) {
            problemSection.style.display = 'block';
            problemSection.style.opacity = '0';
            problemSection.style.transform = 'translateY(20px)';

            setTimeout(() => {
                problemSection.style.transition = 'all 0.5s ease';
                problemSection.style.opacity = '1';
                problemSection.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    // 3단계: 다이어그램과 애니메이션만 표시 (텍스트 섹션들 숨김)
    function showStormDiagram() {
        // 이전 텍스트 섹션들 숨기기
        const redundancySection = document.querySelector('.necessity-content .redundancy-section');
        const problemSection = document.querySelector('.necessity-content .problem-section');
        const solutionPreview = document.querySelector('.solution-preview');

        if (redundancySection) redundancySection.style.display = 'none';
        if (problemSection) problemSection.style.display = 'none';
        if (solutionPreview) solutionPreview.style.display = 'none';

        // 다이어그램만 표시
        const loopDiagram = document.querySelector('.loop-diagram');
        if (loopDiagram) {
            loopDiagram.style.display = 'block';
            loopDiagram.style.opacity = '0';
            loopDiagram.style.transform = 'translateY(20px)';

            setTimeout(() => {
                loopDiagram.style.transition = 'all 0.5s ease';
                loopDiagram.style.opacity = '1';
                loopDiagram.style.transform = 'translateY(0)';

                // 다이어그램 표시 후 애니메이션 실행
                setTimeout(() => {
                    runEnhancedStormAnimation();
                }, 500);
            }, 100);
        }
    }

    // 향상된 스톰 애니메이션 (패킷 흐름 제어 포함)
    function runEnhancedStormAnimation() {
        const swNodes = document.querySelectorAll('#stormDiagram .node');
        const pulseDots = document.querySelectorAll('.pulse-dot');
        const packets = document.querySelectorAll('.packet');
        const cables = document.querySelectorAll('.active-link');

        let interval = 500;
        let animationCount = 0;
        const maxAnimations = 8;

        // 초기 상태 설정
        pulseDots.forEach(dot => {
            dot.style.display = 'block';
            dot.classList.add('pulse-animation');
        });

        // 패킷 활성화
        packets.forEach((packet, index) => {
            packet.classList.add('active');
            // 초기 속도 설정
            const animation = packet.querySelector('animateMotion');
            if (animation) {
                animation.setAttribute('dur', '1.5s');
            }
        });

        // 케이블 전송 상태 활성화
        cables.forEach(cable => {
            cable.classList.add('transmitting');
        });

        const anim = setInterval(() => {
            // 스위치 노드들에 스톰 효과 적용
            swNodes.forEach(sw => {
                sw.classList.toggle('storm-active');
            });

            // 패킷 속도 점점 빨라지게
            const packetSpeed = Math.max(0.2, 1.5 - (animationCount * 0.15)); // 1.5초에서 0.2초까지
            packets.forEach(packet => {
                const animation = packet.querySelector('animateMotion');
                if (animation) {
                    animation.setAttribute('dur', `${packetSpeed}s`);
                }

                // 스톰 모드 스타일 적용
                if (animationCount > 3) {
                    packet.classList.add('storm-mode');
                    packet.setAttribute('r', '5');
                }
            });

            // 케이블 글로우 효과 강화
            if (animationCount > 2) {
                cables.forEach(cable => {
                    cable.style.strokeWidth = Math.min(8, 4 + animationCount);
                    cable.style.filter = `drop-shadow(0 0 ${2 + animationCount}px #00ff88)`;
                });
            }

            // 펄스 도트 속도 증가
            const pulseSpeed = Math.max(0.1, 0.8 - (animationCount * 0.08));
            pulseDots.forEach(dot => {
                dot.style.animationDuration = `${pulseSpeed}s`;
            });

            animationCount++;
            interval = Math.max(100, interval - 60);

            if (animationCount >= maxAnimations) {
                clearInterval(anim);

                // 스톰 효과 종료
                swNodes.forEach(sw => {
                    sw.classList.remove('storm-active');
                    sw.classList.add('overloaded');
                });

                // 패킷들을 오버로드 모드로 변경
                packets.forEach(packet => {
                    packet.classList.remove('storm-mode');
                    packet.classList.add('overload-mode');
                    const animation = packet.querySelector('animateMotion');
                    if (animation) {
                        animation.setAttribute('dur', '3s'); // 매우 느려짐
                    }
                });

                // 케이블 오버로드 상태
                cables.forEach(cable => {
                    cable.classList.remove('transmitting');
                    cable.style.stroke = '#cc0000';
                    cable.style.opacity = '0.5';
                    cable.style.strokeWidth = '2';
                    cable.style.filter = 'none';
                });

                // 2초 후 솔루션 미리보기 표시
                setTimeout(() => {
                    showSolutionPreview();
                }, 2000);
            }
        }, interval);
    }

    // 4단계: 솔루션 미리보기 표시 (다이어그램은 유지)
    function showSolutionPreview() {
        const solutionPreview = document.querySelector('.solution-preview');
        if (solutionPreview) {
            solutionPreview.style.display = 'block';
            solutionPreview.style.opacity = '0';
            solutionPreview.style.transform = 'translateY(20px)';

            setTimeout(() => {
                solutionPreview.style.transition = 'all 0.5s ease';
                solutionPreview.style.opacity = '1';
                solutionPreview.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    // 업데이트된 CSS 스타일
    function addStormStyles() {
        if (document.getElementById('storm-animation-styles')) return;

        const style = document.createElement('style');
        style.id = 'storm-animation-styles';
        style.textContent = `
            .storm-active {
                background-color: #ff4444 !important;
                color: white !important;
                animation: stormPulse 0.3s ease-in-out infinite alternate;
                box-shadow: 0 0 20px rgba(255, 68, 68, 0.8) !important;
            }

            .overloaded {
                background-color: #cc0000 !important;
                color: white !important;
                opacity: 0.7 !important;
            }

            .pulse-animation {
                animation: pulseDot 0.8s ease-in-out infinite;
            }

            .packet {
                opacity: 0;
                filter: drop-shadow(0 0 3px #ff4444);
                transition: all 0.3s ease;
            }

            .packet.active {
                opacity: 1;
            }

            .packet.storm-mode {
                fill: #ff0000 !important;
                filter: drop-shadow(0 0 5px #ff0000) !important;
            }

            .packet.overload-mode {
                fill: #cc0000 !important;
                opacity: 0.3 !important;
            }

            .active-link {
                filter: drop-shadow(0 0 2px #00ff88);
                transition: all 0.3s ease;
            }

            .active-link.transmitting {
                animation: cableGlow 0.5s ease-in-out infinite alternate;
            }

            @keyframes stormPulse {
                0% { transform: scale(1); }
                100% { transform: scale(1.1); }
            }

            @keyframes pulseDot {
                0% { transform: scale(0.8); opacity: 0.6; }
                50% { transform: scale(1.2); opacity: 1; }
                100% { transform: scale(0.8); opacity: 0.6; }
            }

            @keyframes cableGlow {
                0% { opacity: 0.8; }
                100% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    // runSTPStep 함수 수정 (기존 코드에서 이 함수만 교체)
    function runSTPStep(step) {
        const root = document.getElementById('stp-root');
        const sw2 = document.getElementById('stp-sw2');
        const sw3 = document.getElementById('stp-sw3');
        const linkRS2 = document.getElementById('link-r-s2');
        const linkRS3 = document.getElementById('link-r-s3');
        const linkS2S3 = document.getElementById('link-s2-s3');

        switch (step) {
            case 1:
                // Bridge ID 표시
                showBridgeIDs();
                showComparisonText("Bridge ID 비교 시작");
                break;

            case 2:
                // Root Bridge 선출을 위한 Bridge ID 비교
                startBridgeIDComparison();
                break;

            case 3:
                // Root Bridge 선정 결과
                selectRootBridge();
                showComparisonText("Root Bridge 선정: 4096.001 (가장 작은 Bridge ID)");
                break;

            case 4:
                // 루트 포트 선출 시나리오 1: Path Cost 차이
                showComparisonText("루트 포트 시나리오 1: Path Cost 비교");
                startRootPortScenario1();
                break;

            case 5:
                // 루트 포트 선출 시나리오 2: Path Cost 동일, Bridge ID 비교
                showComparisonText("루트 포트 시나리오 2: Path Cost 동일");
                startRootPortScenario2();
                break;

            case 6:
                // 루트 포트 선출 시나리오 3: Path Cost, Bridge ID 동일, Port ID 비교
                showComparisonText("루트 포트 시나리오 3: Path Cost & Bridge ID 동일");
                startRootPortScenario3();
                break;

            case 7:
                // 루트 포트 선출 완료
                selectRootPorts();
                showComparisonText("루트 포트 선출 완료");
                break;

            case 8:
                // 지정 포트 선출 시나리오 1: Path Cost 차이
                showComparisonText("지정 포트 시나리오 1: Path Cost 비교");
                startDesignatedPortScenario1();
                break;

            case 9:
                // 지정 포트 선출 시나리오 2: Path Cost 동일, Bridge ID 비교
                showComparisonText("지정 포트 시나리오 2: Path Cost 동일");
                startDesignatedPortScenario2();
                break;

            case 10:
                // 지정 포트 선출 시나리오 3: Path Cost, Bridge ID 동일, Port ID 비교
                showComparisonText("지정 포트 시나리오 3: Path Cost & Bridge ID 동일");
                startDesignatedPortScenario3();
                break;

            case 11:
                // 지정 포트 선출 완료
                selectDesignatedPorts();
                showComparisonText("지정 포트 선출 완료");
                break;

            case 12:
                // 대체 포트 선출 시나리오 1: Path Cost 차이
                showComparisonText("대체 포트 시나리오 1: Path Cost 비교");
                startAlternatePortScenario1();
                break;

            case 13:
                // 대체 포트 선출 시나리오 2: Path Cost 동일, Bridge ID 비교
                showComparisonText("대체 포트 시나리오 2: Path Cost 동일");
                startAlternatePortScenario2();
                break;

            case 14:
                // 대체 포트 선출 시나리오 3: Path Cost, Bridge ID 동일, Port ID 비교
                showComparisonText("대체 포트 시나리오 3: Path Cost & Bridge ID 동일");
                startAlternatePortScenario3();
                break;


            case 15:
            //대체 포트 선출 완료
                selectAlternatePort();
                showComparisonText("대체 포트 및 지정 포트 선출 완료");
                break;

            case 16:
                // 최종 결과 - 루프 차단
                showComparisonText("STP 수렴 완료: 루프 차단");
                finalizeSTConfig();
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

    function startBridgeIDComparison() {
        const root = document.getElementById('stp-root');
        const sw2 = document.getElementById('stp-sw2');
        const sw3 = document.getElementById('stp-sw3');

        // 순차적으로 비교 표시
        const comparisons = [
            { nodes: [root, sw2], text: "Root(4096.001) vs SW2(8192.002)" },
            { nodes: [root, sw3], text: "Root(4096.001) vs SW3(12288.003)" },
            { nodes: [sw2, sw3], text: "SW2(8192.002) vs SW3(12288.003)" }
        ];

        let index = 0;
        function showNextComparison() {
            if (index < comparisons.length) {
                const comp = comparisons[index];

                // 모든 노드에서 비교 효과 제거
                [root, sw2, sw3].forEach(node => {
                    if (node) node.classList.remove('comparing');
                });

                // 현재 비교 노드들에 효과 적용
                comp.nodes.forEach(node => {
                    if (node) node.classList.add('comparing');
                });

                showComparisonText(comp.text);
                index++;
                setTimeout(showNextComparison, 2000);
            }
        }

        showNextComparison();
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
            root.childNodes[0].nodeValue = "Root"; // "SW1" -> "Root"
            root.style.background = '#FFD700';
            root.classList.add('highlight');
        }

        // Winner Bridge ID 표시
        if (rootId) {
            rootId.classList.add('winner');
        }
    }

    // 비교 텍스트 표시 함수
    function showComparisonText(text) {
        // 기존 텍스트 제거
        const existingText = document.getElementById('comparison-text');
        if (existingText) {
            existingText.remove();
        }

        // 새 텍스트 생성
        const textDiv = document.createElement('div');
        textDiv.id = 'comparison-text';
        textDiv.textContent = text;
        textDiv.style.cssText = `
            position: absolute;
            top: 130px;
            left: 57%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: #FFD700;
            padding: 10px 20px;
            border-radius: 10px;
            font-weight: bold;
            font-size: 18px;
            z-index: 100;
            border: 2px solid #4FC3F7;
        `;

        const diagram = document.getElementById('stpDiagram');
        if (diagram) {
            diagram.appendChild(textDiv);
        }
    }

    // Path Cost 비교 애니메이션
    function startPathCostComparison() {
        const sw2 = document.getElementById('stp-sw2');
        const sw3 = document.getElementById('stp-sw3');
        const linkRS2 = document.getElementById('link-r-s2');
        const linkRS3 = document.getElementById('link-r-s3');

        // Path Cost 비교 하이라이트
        [sw2, sw3].forEach(node => {
            if (node) {
                node.style.background = '#FF6B6B';
                node.classList.add('comparing');
            }
        });

        // 링크 하이라이트
        [linkRS2, linkRS3].forEach(link => {
            if (link) link.setAttribute('stroke', '#FF6B6B');
        });

        // Path Cost 정보 표시
        setTimeout(() => {
            showComparisonText("SW2 Path Cost: 19, SW3 Path Cost: 19 → 동일!");
        }, 2000);
    }

    // 루트 포트 선출을 위한 Bridge ID 재비교
    function startRootPortBridgeIDComparison() {
        const sw2 = document.getElementById('stp-sw2');
        const sw3 = document.getElementById('stp-sw3');

        // Bridge ID 재비교 하이라이트
        [sw2, sw3].forEach(node => {
            if (node) {
                node.style.background = '#9C27B0';
                node.classList.add('comparing');
            }
        });

        setTimeout(() => {
            showComparisonText("Bridge ID: SW2(8192.002) < SW3(12288.003)");
        }, 2000);
    }

    // 루트 포트 선출 완료
    function selectRootPorts() {
        resetHighlights();
        const sw2 = document.getElementById('stp-sw2');
        const sw3 = document.getElementById('stp-sw3');
        const linkRS2 = document.getElementById('link-r-s2');
        const linkRS3 = document.getElementById('link-r-s3');

        // 비교 효과 제거 및 루트 포트 색상 설정
        [sw2, sw3].forEach(node => {
            if (node) {
                node.classList.remove('comparing');
                node.style.background = '#007bff'; // 루트 포트 색상
            }
        });

        [linkRS2, linkRS3].forEach(link => {
            if (link) link.setAttribute('stroke', '#007bff');
        });

        // 루트 포트 라벨 표시
        const rootPorts = ['rp1', 'rp2'];
        rootPorts.forEach((id, index) => {
            setTimeout(() => {
                const label = document.getElementById(id);
                if (label) label.classList.add('show');
            }, 300 * (index + 1));
        });

        // BPDU 전송
        const root = document.getElementById('stp-root');
        createBPDU('stpDiagram', root, sw2, '#FFD700');
        createBPDU('stpDiagram', root, sw3, '#FFD700');
    }

    // 지정 포트 비교
    function startDesignatedPortComparison() {
        const root = document.getElementById('stp-root');
        const sw2 = document.getElementById('stp-sw2');
        const sw3 = document.getElementById('stp-sw3');

        // Root에서 각 세그먼트의 지정 포트 선출
        [root, sw2, sw3].forEach(node => {
            if (node) {
                node.style.background = '#28a745'; // 지정 포트 색상
                node.classList.add('comparing');
            }
        });

        setTimeout(() => {
            showComparisonText("각 세그먼트별 최적 경로 → 지정 포트 선출");
        }, 2000);

        setTimeout(() => {
            // 지정 포트 라벨 표시
            const designatedPorts = ['dp1', 'dp3'];
            designatedPorts.forEach((id, index) => {
                setTimeout(() => {
                    const label = document.getElementById(id);
                    if (label) label.classList.add('show');
                }, 200 * (index + 1));
            });
        }, 2000);
    }

    // 대체 포트 선출 비교
    function startAlternatePortComparison() {
        const sw2 = document.getElementById('stp-sw2');
        const sw3 = document.getElementById('stp-sw3');
        const linkS2S3 = document.getElementById('link-s2-s3');

        // SW2 vs SW3 비교
        [sw2, sw3].forEach(node => {
            if (node) {
                node.style.background = '#dc3545'; // 대체 포트 색상
                node.classList.add('comparing');
            }
        });

        if (linkS2S3) {
            linkS2S3.setAttribute('stroke', '#dc3545');
            linkS2S3.setAttribute('stroke-width', '6');
        }

        setTimeout(() => {
            showComparisonText("SW2가 지정 포트 → SW3가 대체 포트");
        }, 2000);

        setTimeout(() => {
            // 대체 포트 라벨 표시
            const alternatePort = ['ap1', 'dp2'];
            alternatePort.forEach((id, index) => {
                setTimeout(() => {
                    const label = document.getElementById(id);
                    if (label) label.classList.add('show');
                }, 300 * (index + 1));
            });

            // 링크를 점선으로 변경 (차단 표시)
            if (linkS2S3) {
                linkS2S3.setAttribute('stroke-dasharray', '10,5');
            }
        }, 2000);
    }

    // 최종 STP 설정 완료
    function finalizeSTConfig() {
        const sw2 = document.getElementById('stp-sw2');
        const sw3 = document.getElementById('stp-sw3');
        const linkS2S3 = document.getElementById('link-s2-s3');

        // 모든 비교 효과 제거
        [sw2, sw3].forEach(node => {
            if (node) {
                node.classList.remove('comparing');
            }
        });

        // 링크 차단 (투명도 조절)
        if (linkS2S3) {
            linkS2S3.style.opacity = '0.3';
            linkS2S3.setAttribute('stroke', '#FF4444');
        }

        setTimeout(() => {
            showComparisonText("STP 수렴 완료! 루프 없는 안정적인 네트워크 구성");
        }, 2000);
    }

    // 새로운 시나리오 함수들 추가
    // 루트 포트 시나리오 1: Path Cost 차이로 결정
    function startRootPortScenario1() {
        resetHighlights();

        const comparisons = [
            {
                nodes: [document.getElementById('stp-sw2')],
                links: [document.getElementById('link-r-s2')],
                text: "SW2 → Root: Path Cost 19",
                color: '#00ff00'
            },
            {
                nodes: [document.getElementById('stp-sw3')],
                links: [document.getElementById('link-r-s3')],
                text: "SW3 → Root: Path Cost 100",
                color: '#ff0000'
            },
            {
                nodes: [document.getElementById('stp-sw2')],
                links: [document.getElementById('link-r-s2')],
                text: "SW2 승리: Path Cost가 더 낮음 (19 < 100)",
                color: '#00ff00'
            }
        ];

        runComparisonSequence(comparisons);
    }

    // 루트 포트 시나리오 2: Path Cost 동일, Bridge ID로 결정
    function startRootPortScenario2() {
        resetHighlights();

        const comparisons = [
            {
                nodes: [document.getElementById('stp-sw2')],
                links: [document.getElementById('link-r-s2')],
                text: "SW2: Path Cost 19, Bridge ID 8192.002",
                color: '#ffaa00'
            },
            {
                nodes: [document.getElementById('stp-sw3')],
                links: [document.getElementById('link-r-s3')],
                text: "SW3: Path Cost 19, Bridge ID 12288.003",
                color: '#ffaa00'
            },
            {
                nodes: [document.getElementById('stp-sw2')],
                links: [document.getElementById('link-r-s2')],
                text: "SW2 승리: Bridge ID가 더 낮음 (8192 < 12288)",
                color: '#00ff00'
            }
        ];

        runComparisonSequence(comparisons);
    }

    // 루트 포트 시나리오 3: Path Cost, Bridge ID 동일, Port ID로 결정
    function startRootPortScenario3() {
        resetHighlights();

        const comparisons = [
            {
                nodes: [document.getElementById('stp-sw2')],
                links: [document.getElementById('link-r-s2')],
                text: "SW2: Cost 19, Bridge ID 8192.002, Port ID 1",
                color: '#aa00ff'
            },
            {
                nodes: [document.getElementById('stp-sw3')],
                links: [document.getElementById('link-r-s3')],
                text: "SW3: Cost 19, Bridge ID 8192.002, Port ID 2",
                color: '#aa00ff'
            },
            {
                nodes: [document.getElementById('stp-sw2')],
                links: [document.getElementById('link-r-s2')],
                text: "SW2 승리: Port ID가 더 낮음 (1 < 2)",
                color: '#00ff00'
            }
        ];

        runComparisonSequence(comparisons);
    }

    // 지정 포트 시나리오 1: Path Cost 차이로 결정
    function startDesignatedPortScenario1() {
        resetHighlights();

        const comparisons = [
            {
                nodes: [document.getElementById('stp-root')],
                links: [document.getElementById('link-r-s2')],
                text: "Root → 세그먼트: Path Cost 0",
                color: '#00ff00'
            },
            {
                nodes: [document.getElementById('stp-sw2')],
                links: [document.getElementById('link-r-s2')],
                text: "SW2 → 세그먼트: Path Cost 19",
                color: '#ff0000'
            },
            {
                nodes: [document.getElementById('stp-root')],
                links: [document.getElementById('link-r-s2'), document.getElementById('link-r-s3')],
                text: "Root 승리: Path Cost가 더 낮음 (0 < 19)",
                color: '#00ff00'
            }
        ];

        runComparisonSequence(comparisons);
    }

    // 지정 포트 시나리오 2: Path Cost 동일, Bridge ID로 결정
    function startDesignatedPortScenario2() {
        resetHighlights();

        const comparisons = [
            {
                nodes: [document.getElementById('stp-sw2')],
                links: [document.getElementById('link-s2-s3')],
                text: "SW2: Path Cost 19, Bridge ID 8192.002",
                color: '#ffaa00'
            },
            {
                nodes: [document.getElementById('stp-sw3')],
                links: [document.getElementById('link-s2-s3')],
                text: "SW3: Path Cost 19, Bridge ID 12288.003",
                color: '#ffaa00'
            },
            {
                nodes: [document.getElementById('stp-sw2')],
                links: [document.getElementById('link-s2-s3')],
                text: "SW2 승리: Bridge ID가 더 낮음",
                color: '#00ff00'
            }
        ];

        runComparisonSequence(comparisons);
    }

    // 지정 포트 시나리오 3: Path Cost, Bridge ID 동일, Port ID로 결정
    function startDesignatedPortScenario3() {
        resetHighlights();

        const comparisons = [
            {
                nodes: [document.getElementById('stp-sw2')],
                links: [document.getElementById('link-s2-s3')],
                text: "SW2: Cost 19, Bridge ID 8192.002, Port ID 1",
                color: '#aa00ff'
            },
            {
                nodes: [document.getElementById('stp-sw3')],
                links: [document.getElementById('link-s2-s3')],
                text: "SW3: Cost 19, Bridge ID 8192.002, Port ID 2",
                color: '#aa00ff'
            },
            {
                nodes: [document.getElementById('stp-sw2')],
                links: [document.getElementById('link-s2-s3')],
                text: "SW2 승리: Port ID가 더 낮음",
                color: '#00ff00'
            }
        ];

        runComparisonSequence(comparisons);
    }

    // 대체 포트 시나리오 1: Path Cost 차이로 결정
    function startAlternatePortScenario1() {
        resetHighlights();

        const comparisons = [
            {
                nodes: [document.getElementById('stp-sw2')],
                links: [document.getElementById('link-s2-s3')],
                text: "SW2 → Root: Path Cost 38 (via SW3)",
                color: '#00ff00'
            },
            {
                nodes: [document.getElementById('stp-sw3')],
                links: [document.getElementById('link-s2-s3')],
                text: "SW3 → Root: Path Cost 57 (via SW2)",
                color: '#ff0000'
            },
            {
                nodes: [document.getElementById('stp-sw3')],
                links: [document.getElementById('link-s2-s3')],
                text: "SW3가 대체 포트: Path Cost가 더 높음",
                color: '#ff0000'
            }
        ];

        runComparisonSequence(comparisons);
    }

    // 대체 포트 시나리오 2: Path Cost 동일, Bridge ID로 결정
    function startAlternatePortScenario2() {
        resetHighlights();

        const comparisons = [
            {
                nodes: [document.getElementById('stp-sw2')],
                links: [document.getElementById('link-s2-s3')],
                text: "SW2: Path Cost 38, Bridge ID 8192.002",
                color: '#ffaa00'
            },
            {
                nodes: [document.getElementById('stp-sw3')],
                links: [document.getElementById('link-s2-s3')],
                text: "SW3: Path Cost 38, Bridge ID 12288.003",
                color: '#ffaa00'
            },
            {
                nodes: [document.getElementById('stp-sw3')],
                links: [document.getElementById('link-s2-s3')],
                text: "SW3가 대체 포트: Bridge ID가 더 높음",
                color: '#ff0000'
            }
        ];

        runComparisonSequence(comparisons);
    }

    // 대체 포트 시나리오 3: Path Cost, Bridge ID 동일, Port ID로 결정
    function startAlternatePortScenario3() {
        resetHighlights();

        const comparisons = [
            {
                nodes: [document.getElementById('stp-sw2')],
                links: [document.getElementById('link-s2-s3')],
                text: "SW2: Cost 38, Bridge ID 8192.002, Port ID 2",
                color: '#aa00ff'
            },
            {
                nodes: [document.getElementById('stp-sw3')],
                links: [document.getElementById('link-s2-s3')],
                text: "SW3: Cost 38, Bridge ID 8192.002, Port ID 3",
                color: '#aa00ff'
            },
            {
                nodes: [document.getElementById('stp-sw3')],
                links: [document.getElementById('link-s2-s3')],
                text: "SW3가 대체 포트: Port ID가 더 높음",
                color: '#ff0000'
            }
        ];

        runComparisonSequence(comparisons);
    }

    // 공통 비교 시퀀스 실행 함수 (새로 추가)
    function runComparisonSequence(comparisons) {
        let index = 0;

        function showNextComparison() {
            if (index < comparisons.length) {
                const comp = comparisons[index];

                // 이전 하이라이트 제거
                resetHighlights();

                // 노드 하이라이트
                comp.nodes.forEach(node => {
                    if (node) {
                        node.style.backgroundColor = comp.color;
                        node.style.boxShadow = `0 0 15px ${comp.color}`;
                        node.classList.add('comparing');
                    }
                });

                // 링크 하이라이트
                if (comp.links) {
                    comp.links.forEach(link => {
                        if (link) {
                            link.setAttribute('stroke', comp.color);
                            link.setAttribute('stroke-width', '6');
                        }
                    });
                }

                // 텍스트 표시
                showComparisonText(comp.text);

                index++;
                setTimeout(showNextComparison, 2500);
            }
        }

        showNextComparison();
    }

    // 하이라이트 초기화 함수 (새로 추가)
    function resetHighlights() {
        const nodes = [document.getElementById('stp-root'), document.getElementById('stp-sw2'), document.getElementById('stp-sw3')];
        nodes.forEach(node => {
            if (node) {
                node.style.backgroundColor = '';
                node.style.boxShadow = '';
                node.classList.remove('comparing');
            }
        });

        const links = [document.getElementById('link-r-s2'), document.getElementById('link-r-s3'), document.getElementById('link-s2-s3')];
        links.forEach(link => {
            if (link) {
                link.setAttribute('stroke', 'white');
                link.setAttribute('stroke-width', '4');
            }
        });
    }

    // 헬퍼 함수들
    function createInfoBox(content) {
        // 기존 정보 박스 제거
        const existingBox = document.getElementById('scenario-info-box');
        if (existingBox) existingBox.remove();

        const infoBox = document.createElement('div');
        infoBox.id = 'scenario-info-box';
        infoBox.innerHTML = content;
        infoBox.style.cssText = `
            position: absolute;
            top: 350px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            font-size: 14px;
            border: 2px solid #4FC3F7;
            max-width: 400px;
            z-index: 200;
        `;

        const diagram = document.getElementById('stpDiagram');
        if (diagram) diagram.appendChild(infoBox);
        return infoBox;
    }

    function highlightNodes(nodes, color) {
        nodes.forEach(node => {
            if (node) {
                node.style.backgroundColor = color;
                node.style.boxShadow = `0 0 15px ${color}`;
                node.classList.add('comparing');
            }
        });
    }

    function highlightLinks(links, color) {
        links.forEach(link => {
            if (link) {
                link.setAttribute('stroke', color);
                link.setAttribute('stroke-width', '6');
            }
        });
    }

    // 하이라이트 초기화 함수 (새로 추가)
    function resetHighlights() {
        const nodes = [document.getElementById('stp-root'), document.getElementById('stp-sw2'), document.getElementById('stp-sw3')];
        nodes.forEach(node => {
            if (node) {
                node.style.backgroundColor = '';
                node.style.boxShadow = '';
                node.classList.remove('comparing');
            }
        });

        const links = [document.getElementById('link-r-s2'), document.getElementById('link-r-s3'), document.getElementById('link-s2-s3')];
        links.forEach(link => {
            if (link) {
                link.setAttribute('stroke', 'white');
                link.setAttribute('stroke-width', '4');
            }
        });
    }

    // selectRootPorts 함수 수정 (기존 함수를 찾아서 맨 앞에 resetHighlights() 추가)
    function selectRootPorts() {
        resetHighlights(); // 이 줄 추가

        const sw2 = document.getElementById('stp-sw2');
        const sw3 = document.getElementById('stp-sw3');
        const linkRS2 = document.getElementById('link-r-s2');
        const linkRS3 = document.getElementById('link-r-s3');

        // 비교 효과 제거 및 루트 포트 색상 설정
        [sw2, sw3].forEach(node => {
            if (node) {
                node.classList.remove('comparing');
                node.style.background = '#007bff'; // 루트 포트 색상
            }
        });

        [linkRS2, linkRS3].forEach(link => {
            if (link) link.setAttribute('stroke', '#007bff');
        });

        // 루트 포트 라벨 표시
        const rootPorts = ['rp1', 'rp2'];
        rootPorts.forEach((id, index) => {
            setTimeout(() => {
                const label = document.getElementById(id);
                if (label) label.classList.add('show');
            }, 300 * (index + 1));
        });

        // BPDU 전송
        const root = document.getElementById('stp-root');
        createBPDU('stpDiagram', root, sw2, '#FFD700');
        createBPDU('stpDiagram', root, sw3, '#FFD700');
    }

    // selectDesignatedPorts 함수 추가 (새로 추가)
    function selectDesignatedPorts() {
        resetHighlights();

        const root = document.getElementById('stp-root');
        const sw2 = document.getElementById('stp-sw2');

        if (root) {
            root.style.background = '#28a745';
        }

        if (sw2) {
            sw2.style.background = '#28a745';
        }

        // 지정 포트 라벨 표시
        const designatedPorts = ['dp1', 'dp3'];
        designatedPorts.forEach((id, index) => {
            setTimeout(() => {
                const label = document.getElementById(id);
                if (label) label.classList.add('show');
            }, 200 * (index + 1));
        });
    }

    function selectAlternatePort() {
        resetHighlights();

        const sw2 = document.getElementById('stp-sw2');
        const sw3 = document.getElementById('stp-sw3');

        if (sw2) {
            sw2.style.background = '#288ba7';
        }

        if (sw3) {
            sw3.style.background = '#288ba7';
        }

        // 대체 포트 라벨 표시
        const alternatePort = ['ap1', 'dp2'];
        alternatePort.forEach((id, index) => {
            setTimeout(() => {
                const label = document.getElementById(id);
                if (label) label.classList.add('show');
            }, 200 * (index + 1));
        });
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
        const sw3 = document.getElementById('rstp-sw3');
        const link_sw1_sw3 = document.getElementById('link-sw1-sw3');

        switch (step) {
            case 1:
                // Root 하이라이트
                if (root) {
                    root.style.background = '#FFD700';
                    root.classList.add('highlight');
                }
                break;

            case 2:
                // root ↔ sw1 BPDU 교환
                if (root && sw1) createBPDU('rstpDiagram', root, sw1, '#FFD700');
                break;

            case 3:
                // sw1 하이라이트
                if (sw1) {
                    sw1.style.background = '#FF4500';
                    sw1.classList.add('highlight');
                }
                break;

            case 4:
                // sw1 ↔ sw3 BPDU 교환
                if (sw1 && sw3) createBPDU('rstpDiagram', sw1, sw3, '#FF4500');
                if (sw3) {
                    sw3.style.background = '#ca45ff';
                    sw3.classList.add('highlight');
                }
                break;

            case 5:
                // 케이블 단절 (sw1-sw3 링크 끊김 표시)
                if (link_sw1_sw3) {
                    link_sw1_sw3.classList.add('link-down');
                }
                // sw1, sw3 하이라이트 해제
                if (sw1) {
                    sw1.classList.remove('highlight');
                    sw1.style.background = '';
                }
                if (sw3) {
                    sw3.classList.remove('highlight');
                    sw3.style.background = '';
                }
                // sw1-sw3 BPDU 애니메이션 제거
                bpduAnimations.forEach(anim => {
                    if (anim.element && anim.element.closest('#rstpDiagram')) {
                        if (anim.frameId) cancelAnimationFrame(anim.frameId);
                        anim.element.remove();
                    }
                });
                bpduAnimations = bpduAnimations.filter(anim =>
                    !(anim.element && anim.element.closest('#rstpDiagram'))
                );
                break;

            case 6:
                // root ↔ sw2 BPDU 교환
                if (root && sw2) {
                    sw2.style.background = '#32CD32';
                    sw2.classList.add('highlight');
                    createBPDU('rstpDiagram', root, sw2, '#FFD700');
                }
                break;

            case 7:
                // sw2 ↔ sw3 BPDU 교환
                if (sw2 && sw3) createBPDU('rstpDiagram', sw2, sw3, '#32CD32');
                break;

            case 8:
                // sw3 하이라이트 (최종 경로 안정화)
                if (sw3) {
                    sw3.style.background = '#ca45ff';
                    sw3.classList.add('highlight');
                }
                break;
        }
    }

    function runMSTPStep(step) {
        const centerLine = document.getElementById('center-line');
        const oldNodes = ['old1','old2','old3','old4'].map(id => document.getElementById(id));
        const newNodes = ['new1','new2','new3','new4'].map(id => document.getElementById(id));
        const lines = ['line1','line2','line3','line4'].map(id => document.getElementById(id));
        const newLines = ['newLine1','newLine2','newLine3','newLine4'].map(id => document.getElementById(id));
        const moveDistance = 250;

        switch(step) {
            case 1:
                oldNodes.forEach(node => {
                    if(node) node.style.transform = `translateX(-${moveDistance}px)`;
                });
                newNodes.forEach(node => {
                    if(node) {
                        node.style.opacity='1';
                        node.style.transform = `translateX(${moveDistance}px)`;
                    }
                });
                // 기존 라인 이동
                lines.forEach(line => {
                    if(line) line.setAttribute('x1', parseInt(line.getAttribute('x1')) - moveDistance);
                    if(line) line.setAttribute('x2', parseInt(line.getAttribute('x2')) - moveDistance);
                });
                // 새로운 라인 등장
                newLines.forEach(line => {
                    if(line) {
                        line.style.opacity='1';
                        line.setAttribute('x1', parseInt(line.getAttribute('x1')) + moveDistance);
                        line.setAttribute('x2', parseInt(line.getAttribute('x2')) + moveDistance);
                    }
                });

                if(centerLine) centerLine.style.opacity='1';
                break;

            case 2:
                const arrowSw1 = document.getElementById('arrowBox-sw1');
                const arrowSw3 = document.getElementById('arrowBox-sw3');
                const arrowSw1_1 = document.getElementById('arrowBox-sw1_1');
                const arrowSw3_1 = document.getElementById('arrowBox-sw3_1');
                if(arrowSw1) arrowSw1.style.opacity='1';
                if(arrowSw3) arrowSw3.style.opacity='1';
                if(arrowSw1_1) arrowSw1_1.style.opacity='1';
                if(arrowSw3_1) arrowSw3_1.style.opacity='1';
                break;

            case 3:
                ['vlan-sw1','vlan-sw2','vlan-sw3','vlan-sw4'].forEach(id => {
                    const el = document.getElementById(id);
                    if(el) el.style.opacity='1';
                });
                break;

            case 4:
                ['mst-region_A', 'mst-region_B'].forEach(id => {
                    const mstRegion = document.getElementById(id);
                    if(mstRegion) mstRegion.style.opacity='1';
                });
                break;

            case 5:
                highlightArrowBox('arrowBox-sw1');
                break;

            case 6:
                resetArrowBox('arrowBox-sw1');
                highlightArrowBox('arrowBox-sw3');
                break;

            case 7:
                resetArrowBox('arrowBox-sw3');
                highlightArrowBox('arrowBox-sw1_1');
                break;

            case 8:
                resetArrowBox('arrowBox-sw1_1');
                highlightArrowBox('arrowBox-sw3_1');
                break;

            case 9:
                resetArrowBox('arrowBox-sw3_1');
                break;
        }
    }

    // 하이라이트 효과 함수
    function highlightArrowBox(elementId) {
        const box = document.getElementById(elementId);
        if(box) {
            box.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease';
            box.style.transform = 'scale(1.1)';
            box.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.8)';
            box.style.background = 'rgba(255, 215, 0, 0.2)';
        }
    }

    function resetArrowBox(elementId) {
        const box = document.getElementById(elementId);
        if(box) {
            box.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease';
            box.style.transform = 'scale(1)';
            box.style.boxShadow = 'none';

            // 각 박스별 원래 배경색으로 리셋
            switch(elementId) {
                case 'arrowBox-sw1':
                    box.style.background = 'rgba(255, 68, 68, 0.2)';
                    break;
                case 'arrowBox-sw3':
                    box.style.background = 'rgba(76, 175, 80, 0.2)';
                    break;
                case 'arrowBox-sw1_1':
                    box.style.background = 'rgba(121, 85, 72, 0.4)';
                    break;
                case 'arrowBox-sw3_1':
                    box.style.background = 'rgba(233, 30, 99, 0.2)';
                    break;
            }
        }
    }



    // MSTP 다이어그램에서 라인이 노드와 함께 움직이도록 하는 함수들

    // 노드의 중심 좌표를 계산하는 함수
    function getNodeCenter(nodeId) {
        const node = document.getElementById(nodeId);
        if (!node) return { x: 0, y: 0 };

        const rect = node.getBoundingClientRect();

        // 부모 요소 기준 좌표로 변환하려면 offsetParent 위치 고려
        const parentRect = node.parentElement.getBoundingClientRect();

        const x = rect.left - parentRect.left + rect.width / 2;
        const y = rect.top - parentRect.top + rect.height / 2;

        return { x, y };
    }

    // 라인 좌표를 업데이트하는 함수
    function updateLinePositions() {
        // 화면 너비가 768px 이하일 때 모바일로 간주
        const isMobile = window.innerWidth <= 768;

        const scale = isMobile ? 0.5 : 1; // 모바일이면 CSS scale 0.5 적용
        const offsetX = isMobile ? 0 : 0; // 필요 시 조정
        const offsetY = isMobile ? 0 : 0;

        const oldNodes = ['old1','old2','old3','old4'].map(id => document.getElementById(id));
        const newNodes = ['new1','new2','new3','new4'].map(id => document.getElementById(id));

        function getNodeCenter(node) {
            if (!node) return { x: 0, y: 0 };
            const rect = node.getBoundingClientRect();
            const parentRect = node.parentElement.getBoundingClientRect();
            return {
                x: (rect.left - parentRect.left + rect.width / 2) / scale + offsetX,
                y: (rect.top - parentRect.top + rect.height / 2) / scale + offsetY
            };
        }

        // 기존 라인
        const lines = ['line1','line2','line3','line4'];
        const oldCenters = oldNodes.map(getNodeCenter);
        lines.forEach((lineId, idx) => {
            const line = document.getElementById(lineId);
            if (line) {
                const from = oldCenters[idx];
                const to = oldCenters[(idx + 1) % oldCenters.length];
                line.setAttribute('x1', from.x);
                line.setAttribute('y1', from.y);
                line.setAttribute('x2', to.x);
                line.setAttribute('y2', to.y);
            }
        });

        // 새로운 라인
        const newLines = ['newLine1','newLine2','newLine3','newLine4'];
        const newCenters = newNodes.map(getNodeCenter);
        newLines.forEach((lineId, idx) => {
            const line = document.getElementById(lineId);
            if (line) {
                const from = newCenters[idx];
                const to = newCenters[(idx + 1) % newCenters.length];
                line.setAttribute('x1', from.x);
                line.setAttribute('y1', from.y);
                line.setAttribute('x2', to.x);
                line.setAttribute('y2', to.y);
            }
        });
    }

    // 리사이즈 이벤트에서도 모바일 체크 적용
    window.addEventListener('resize', () => {
        setTimeout(updateLinePositions, 100);
    });


    // 노드들의 위치 변화를 감지하고 라인 업데이트
    function observeNodePositions() {
        const nodes = ['old1', 'old2', 'old3', 'old4', 'new1', 'new2', 'new3', 'new4'];

        nodes.forEach(nodeId => {
            const node = document.getElementById(nodeId);
            if (node) {
                // Mutation Observer로 스타일 변화 감지
                const observer = new MutationObserver(() => {
                    updateLinePositions();
                });

                observer.observe(node, {
                    attributes: true,
                    attributeFilter: ['style']
                });

                // Transition 이벤트도 감지
                node.addEventListener('transitionstart', updateLinePositions);
                node.addEventListener('transitionend', updateLinePositions);
            }
        });
    }

    // 초기화 및 주기적 업데이트
    function initMSTPLines() {
        // 초기 라인 위치 설정
        updateLinePositions();

        // 노드 위치 변화 감지 시작
        observeNodePositions();

        // 안전을 위한 주기적 업데이트 (애니메이션 중)
        const intervalId = setInterval(updateLinePositions, 50);

        // 10초 후 주기적 업데이트 중단 (애니메이션 완료 후)
        setTimeout(() => {
            clearInterval(intervalId);
        }, 10000);
    }

    // 페이지 로드 후 초기화
    document.addEventListener('DOMContentLoaded', initMSTPLines);

    // 윈도우 리사이즈 시에도 라인 위치 재계산
    window.addEventListener('resize', () => {
        setTimeout(updateLinePositions, 100);
    });


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
        addStormStyles();
        showSlide(0);
    });